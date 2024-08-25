// This is an example of to protect an API route
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { MiniAppPaymentSuccessPayload } from "@worldcoin/minikit-js";

import type { NextApiRequest, NextApiResponse } from "next";
import { connectMongo } from "../../../lib/mongodb";
import { Game, Payment } from "../models/types";

interface IRequestPayload {
  payload: MiniAppPaymentSuccessPayload;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (session) {
    const { payload } = JSON.parse(req.body) as IRequestPayload;

    const db = await connectMongo();

    const gamesCollection = db.collection<Game>("games");
    const currentGame = await gamesCollection.findOne({ active: true });

    if (!currentGame) throw new Error("Failed to retrieve current game");

    const paymentsCollection = db.collection<Payment>("payments");

    const currentPayment = await paymentsCollection.findOne({
      gameId: currentGame._id,
      status: "pending",
      user: session.user?.name,
    });

    if (payload.reference === currentPayment.reference) {
      const response = await fetch(
        `https://developer.worldcoin.org/api/v2/minikit/transaction/${payload.transaction_id}?app_id=${process.env.WLD_CLIENT_ID}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.DEV_PORTAL_API_KEY}`,
          },
        }
      );
      const transaction = await response.json();

      const success =
        transaction.reference == currentPayment.reference &&
        transaction.status != "failed";

      currentPayment.updateOne(
        { _id: currentPayment._id },
        { status: success ? "paid" : "failed", wallet: transaction.from }
      );

      return res.send({ success });
    }
  }

  res.send({
    error: "You must be signed in to view the protected content on this page.",
  });
}
