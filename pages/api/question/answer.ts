// This is an example of to protect an API route
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

import type { NextApiRequest, NextApiResponse } from "next";
import { connectMongo } from "../../../lib/mongodb";
import { Game, Trivia } from "../models/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  // const props = JSON.parse(req.body);
  // console.log("req.body: ", props);
  // console.log("req.body.answer: ", props.answer);
  console.log("body: ", req.body);

  if (!req.body.answer)
    return res.send({
      error: "Answer must be provided",
    });
  //Check if req.body contains answer

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
    const currentGame = await gamesCollection.findOne({ active: true });

    if (!currentGame) throw new Error("Failed to retrieve current game");

    const trivia = await triviasCollection.findOne({
      user: userWallet,
      gameId: currentGame?._id,
    });

    if (!trivia) throw new Error("user not allowed in the game");

    const currentQuestion = trivia.questions.pop();

    if (!currentQuestion || currentQuestion.answer)
      throw new Error("failed to retrieve current question");

    currentQuestion.success = req.body.answer === currentQuestion.correctAnswer;
    trivia.questions = [...trivia.questions, currentQuestion];

    return currentQuestion.success;
  } catch (error) {
    throw new Error("Unexpected error answering question");
  }
}
