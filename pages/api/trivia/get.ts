// This is an example of to protect an API route
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

import type { NextApiRequest, NextApiResponse } from "next";
import { connectMongo } from "../../../lib/mongodb";
import { Game, Trivia } from "../models/types";

interface TriviaQuestion {
  id: number;
  dificulty: number;
  text: string;
  options: string[];
  answer: string;
  success?: boolean;
}

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
    const triviaCollection = db.collection<Trivia>("trivias");

    const userWallet = "0xblabla";
    const currentGame = await gamesCollection.findOne({ active: true });

    if (!currentGame) throw new Error("Failed to retrieve current game");
    console.log("currentGame: ", currentGame);

    const trivia = await triviaCollection.findOne({
      user: userWallet,
      gameId: currentGame._id,
    });

    if (!trivia) throw new Error("Trivia not found");

    return res.send({ ...trivia });
  } catch (error) {
    console.log("error: ", error);
    throw new Error("Unexpected error fetching trivia");
  }
}
