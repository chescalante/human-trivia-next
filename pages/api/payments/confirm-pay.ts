// This is an example of to protect an API route
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { MiniAppPaymentSuccessPayload } from "@worldcoin/minikit-js";

import type { NextApiRequest, NextApiResponse } from "next";
import { connectMongo } from "../../../lib/mongodb";
import { Game, Payment } from "../models/types";
import { createPublicClient, http } from "viem";
import { waitForTransactionReceipt } from "viem/actions";
import { optimism } from "viem/chains";

// interface IRequestPayload {
//   payload: MiniAppPaymentSuccessPayload;
// }
interface IRequestPayload {
  transactionHash: string;
  reference: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (session) {
    const { transactionHash, reference } = JSON.parse(
      req.body
    ) as IRequestPayload;

    const db = await connectMongo();

    const gamesCollection = db.collection<Game>("games");
    const currentGame = await gamesCollection.findOne({ active: true });

    if (!currentGame) throw new Error("Failed to retrieve current game");

    const paymentsCollection = db.collection<Payment>("payments");

    const currentPayment = await paymentsCollection.findOne({
      gameId: currentGame._id,
      status: "pending",
      user: session.user?.name ?? "failed-to-retrieve-user",
    });

    if (currentPayment && reference === currentPayment.reference) {
      // Cant do if event subsdcribev doesnt work
      // const response = await fetch(
      //   `https://developer.worldcoin.org/api/v2/minikit/transaction/${payload.transaction_id}?app_id=${process.env.WLD_CLIENT_ID}`,
      //   {
      //     method: "GET",
      //     headers: {
      //       Authorization: `Bearer ${process.env.DEV_PORTAL_API_KEY}`,
      //     },
      //   }
      // );
      const publicClient = createPublicClient({
        chain: optimism,
        transport: http(),
      });

      const response = await publicClient.waitForTransactionReceipt({
        hash: transactionHash as `0x${string}`,
      });

      const success =
        response.status === "success" &&
        response.to === "0xd59664CD61db33814fBe16Eb96fd0bf00de39f7d";

      await paymentsCollection.updateOne(
        { _id: currentPayment._id },
        {
          $set: {
            ...currentPayment,
            status: success ? "paid" : "failed",
            wallet: response.from,
          },
        }
      );

      return res.send({ success });
    }
  }

  res.send({
    error: "You must be signed in to view the protected content on this page.",
  });
}
