// This is an example of to protect an API route
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

import type { NextApiRequest, NextApiResponse } from "next";
import { connectMongo } from "../../../lib/mongodb";
import { randomInt } from "crypto";
import { Game, Question, Trivia } from "../models/types";

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

    const userWallet = "0xblabla";

    const gamesCollection = db.collection<Game>("games");
    const triviasCollection = db.collection<Trivia>("trivias");
    const questionsCollection = db.collection<Question>("questions");
    const currentGame = await gamesCollection.findOne({ active: true });

    if (!currentGame) throw new Error("Failed to retrieve current game");

    const trivia = await triviasCollection.findOne({
      filter: {
        user: userWallet,
        gameId: currentGame._id,
      },
    });

    const difficulty = Math.floor(trivia?.questions.length ?? 0 / 4) + 1;

    const questions = await questionsCollection.find({ difficulty }).toArray();
    let rng = (randomInt(3000) % questions.length) + 1;

    const currentQuestion = questions[rng];

    if (!currentQuestion) throw new Error("couldn't retrieve a new question");

    return res.send({ ...currentQuestion });
  } catch (error) {
    console.log("error: ", error);
    throw new Error("Unexpected error retrieving question");
  }
}
