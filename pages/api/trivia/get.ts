// This is an example of to protect an API route
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

import type { NextApiRequest, NextApiResponse } from "next";
import { connectMongo } from "../../../lib/mongodb";
import Game from "../models/game";
import Trivia from "../models/trivia";

interface TriviaReply {
  user: string;
  gameId: string;
  triviaStatus: "running" | "failed" | "success";
  questions: TriviaQuestion[];
};

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

    if (!trivia) throw new Error("Trivia not found");

    return trivia;
  } catch (error) {
    throw new Error("Unexpected error fetching trivia");
  }
}
