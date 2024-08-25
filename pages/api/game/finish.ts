// This is an example of to protect an API route
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

import type { NextApiRequest, NextApiResponse } from "next";
import { connectMongo } from "../../../lib/mongodb";
import { addDays } from "date-fns";
import { Game, Payment, Trivia } from "../models/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session)
    return res.send({
      error:
        "You must be signed in to view the protected content on this page.",
    });

  try {
    const db = await connectMongo();

    const gamesCollection = db.collection<Game>("games");
    const currentGame = await gamesCollection.findOne({ active: true });

    if (!currentGame) throw new Error("Failed to retrieve current game");

    currentGame.active = false;

    gamesCollection.updateOne({ _id: currentGame._id }, { $set: currentGame });

    const triviasCollection = db.collection<Trivia>("trivias");

    const successfulTrivias = await triviasCollection
      .find({
        gameId: currentGame._id,
        triviaStatus: "success",
      })
      .toArray();

    const paymentsCollection = db.collection<Payment>("payments");

    const prize = currentGame.prizePool / successfulTrivias.length;

    for (let i = 0; i < successfulTrivias.length; i++) {
      const trivia = successfulTrivias[i];

      const currentPayment = await paymentsCollection.findOne({
        gameId: currentGame._id,
        user: trivia.user,
      });

      const wallet = currentPayment?.wallet;

      if (wallet) {
        // transfer money
      }
    }

    gamesCollection.insertOne({
      active: true,
      startDate: new Date(),
      finishDate: addDays(Date.now(), 1),
      prizePool: successfulTrivias.length === 0 ? currentGame.prizePool : 0, // TODO: Define prizepool
      playersCount: 0,
      ticketPrice: 0, //TODO: Ticket price
    });

    return res.send({});
  } catch (error) {
    throw new Error("Unexpected error retrieving current game");
  }
}

export async function finishGame(): Promise<void> {}
