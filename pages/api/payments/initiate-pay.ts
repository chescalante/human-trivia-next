// This is an example of to protect an API route
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

import type { NextApiRequest, NextApiResponse } from "next";
import { connectMongo } from "../../../lib/mongodb";
import { Game, Payment } from "../models/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (session) {
    const uuid = crypto.randomUUID().replace(/-/g, "");

    const db = await connectMongo();

    const gamesCollection = db.collection<Game>("games");
    const currentGame = await gamesCollection.findOne({ active: true });

    if (!currentGame) throw new Error("Failed to retrieve current game");

    const paymentsCollection = db.collection<Payment>("payments");

    paymentsCollection.insertOne({
      reference: uuid,
      status: "pending",
      user: session.user?.name,
      gameId: currentGame._id,
    });

    return res.send({
      id: uuid,
    });
  }

  res.send({
    error: "You must be signed in to view the protected content on this page.",
  });
}
