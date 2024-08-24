// This is an example of to protect an API route
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

import type { NextApiRequest, NextApiResponse } from "next";
import { connectMongo } from "../../../lib/mongodb";
import Game from "../models/game";
import { addDays } from "date-fns";

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
    await connectMongo();

    const currentGame = await Game.findOne({ active: true });

    if (!currentGame) throw new Error("Failed to retrieve current game");

    currentGame.active = false;
    currentGame.save();

    Game.create({
      startDate: Date.now(),
      finishDate: addDays(Date.now(), 1),
      winners: [], //userIds
      prizePool: 0, // TODO: Define prizepool
      playersCount: 0,
      ticketPrice: 0, //TODO: Ticket price
    });

    //Split prize
    const prize = currentGame.prizePool / currentGame.winners.length;
    //SEND MONEY TO WINNERS with private key
  } catch (error) {
    throw new Error("Unexpected error retrieving current game");
  }
}

export async function finishGame(): Promise<void> {}
