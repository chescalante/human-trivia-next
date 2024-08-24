// This is an example of to protect an API route
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

import type { NextApiRequest, NextApiResponse } from "next";
import { connectMongo } from "../../../lib/mongodb";
import Game from "../models/game";
import Trivia from "../models/trivia";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  const props = JSON.parse(req.body);
  console.log("req.body: ", props);
  console.log("req.body.answer: ", props.answer);

  if (!props.answer)
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
    await connectMongo();

    const userWallet = "0xblabla";
    const currentGame = await Game.findOne({ active: true });

    const trivia = await Trivia.findOne({
      user: userWallet,
      gameId: currentGame?.id,
    });

    if (!trivia) throw new Error("user not allowed in the game");

    const currentQuestion = trivia.questions.pop();

    if (!currentQuestion || currentQuestion.answer)
      throw new Error("failed to retrieve current question");

    currentQuestion.success = props.answer === currentQuestion.correctAnswer;
    trivia.questions = [...trivia.questions, currentQuestion];

    return currentQuestion.success;
  } catch (error) {
    throw new Error("Unexpected error answering question");
  }
}
