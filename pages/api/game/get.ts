// This is an example of to protect an API route
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

import type { NextApiRequest, NextApiResponse } from "next"
import { connectMongo } from "../../../lib/mongodb"
import Game from "../models/game"

export type GameReply = {
  id: string;
  startDate: Date;
  finishDate: Date;
  winners: string[]; //userIds
  prizePool: number;
  playersCount: number;
  ticketPrice: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.send({
      content:
        "This is protected content. You can access this content because you are signed in.",
    })
  }

  try {
    await connectMongo();

    const currentGame = await Game.findOne({ active: true });

    if (!currentGame) throw new Error("Failed to retrieve current game");

    const game: GameReply = currentGame?.toObject();

    return game;
  } catch (error) {
    throw new Error("Unexpected error retrieving current game");
  }
}
