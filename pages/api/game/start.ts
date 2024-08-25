// This is an example of to protect an API route
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

import type { NextApiRequest, NextApiResponse } from "next";
import { connectMongo } from "../../../lib/mongodb";
import { addDays } from "date-fns";
import { Game } from "../models/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  // if (!session)
  //   return res.send({
  //     error:
  //       "You must be signed in to view the protected content on this page.",
  //   });

  try {
    const db = await connectMongo();

    const gamesCollection = db.collection<Game>("games");

    const currentGame = await gamesCollection.findOne({ active: true });

    if (currentGame) throw new Error("Game already running");

    await gamesCollection.insertOne({
      startDate: new Date(),
      finishDate: addDays(Date.now(), 1),
      winners: [], //userIds
      prizePool: 1000, // TODO: Define prizepool
      playersCount: 0,
      ticketPrice: 0, //TODO: Ticket price
      active: true,
    });

    return res.send({ msg: "game started" });
  } catch (error) {
    console.log("error: ", error);
    throw new Error("Unexpected error starting new game");
  }
}

export async function finishGame(): Promise<void> {}
