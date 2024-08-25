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

  // if (!session)
  //   return res.send({
  //     error:
  //       "You must be signed in to view the protected content on this page.",
  //   });

  try {
    const db = await connectMongo();
    const userWallet = "0xblabla";

    const currentGame = await db
      .collection<Game>("games")
      .findOne({ active: true });

    if (!currentGame) throw new Error("Failed to retrieve current game");

    const triviaCollection = db.collection<Trivia>("trivia");
    const trivia = await triviaCollection.findOne({
      user: userWallet,
      gameId: currentGame._id,
    });

    if (trivia) throw new Error("User already participating on the the trivia");

    const newTrivia = await triviaCollection.insertOne({
      user: userWallet,
      gameId: currentGame._id,
      triviaStatus: "running",
      questions: [],
    });

    return res.send({ ...newTrivia });
  } catch (error) {
    console.log("error: ", error);
    throw new Error("Unexpected error joining the trivia");
  }
}
