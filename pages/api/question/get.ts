// This is an example of to protect an API route
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

import type { NextApiRequest, NextApiResponse } from "next";
import { connectMongo } from "../../../lib/mongodb";
import { randomInt } from "crypto";
import { Game, ITriviaQuestion, Question, Trivia } from "../models/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  /* const session = await getServerSession(req, res, authOptions);

  if (!session)
    return res.send({
      error:
        "You must be signed in to view the protected content on this page.",
    });
 */
  try {
    const db = await connectMongo();

    const gamesCollection = db.collection<Game>("games");
    const triviasCollection = db.collection<Trivia>("trivias");
    const questionsCollection = db.collection<Question>("questions");
    const currentGame = await gamesCollection.findOne({ active: true });

    if (!currentGame) throw new Error("Failed to retrieve current game");

    // TODO: FILTER TRIVIAS, throwing 500
    const trivia = await triviasCollection.findOne();

    if (!trivia) throw new Error("Failed to retrieve current game");

    const difficulty = Math.floor(trivia?.questions.length ?? 0 / 4) + 1;

    const questions = await questionsCollection.find().toArray();
    let rng = (randomInt(3000) % questions.length) + 1;
    console.log();
    const { correctAnswer, ...currentQuestion } = questions[rng];

    if (!currentQuestion) throw new Error("couldn't retrieve a new question");

    const currQuestion: ITriviaQuestion = { ...currentQuestion, answer: "" };
    console.log({ currQuestion });

    await triviasCollection.updateOne(
      {
        user: "failed-to-retrieve-user",
        gameId: currentGame._id,
      },
      {
        $set: {
          ...trivia,
          questions: [...trivia?.questions, currQuestion],
        },
      }
    );
    return res.send({ ...currentQuestion });
  } catch (error) {
    console.log("error: ", error);
    throw new Error("Unexpected error retrieving question");
  }
}
