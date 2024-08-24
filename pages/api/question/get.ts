// This is an example of to protect an API route
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

import type { NextApiRequest, NextApiResponse } from "next";
import { connectMongo } from "../../../lib/mongodb";
import Game from "../models/game";
import Trivia from "../models/trivia";
import { randomInt } from "crypto";
import Question, { IQuestion } from "../models/question";

interface QuestionReply {

}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  const body = JSON.parse(req.body);
  console.log("req.body: ", body);
  console.log("req.body: ", body.answer);
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
          filter: {
            user: userWallet,
            gameId: currentGame?.id,
          },
        });
    
        const difficulty = Math.floor(trivia?.questions.length ?? 0 / 4) + 1;
    
        const questions = await Question.find({ difficulty });
        let rng = (randomInt(3000) % questions.length) + 1;
    
        const currentQuestion = questions[rng].toObject<IQuestion>();
    
        if (!currentQuestion) throw new Error("couldn't retrieve a new question");
    
        return currentQuestion;
      } catch (error) {
        throw new Error("Unexpected error retrieving question");
      }
}
