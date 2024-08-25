import { ObjectId } from "mongodb";

export interface Game {
  active: boolean;
  startDate: Date;
  finishDate: Date;
  winners: string[]; //userIds
  prizePool: number;
  playersCount: number;
  ticketPrice: number;
  // fee: number; //Should be an env var but don't forget your piece of cake
}

export interface Question {
  text: string;
  correctAnswer: string;
  difficulty: number;
  options: string[];
}

export interface Trivia {
  user: string;
  gameId: ObjectId;
  triviaStatus: "success" | "running" | "failed";
  questions: ITriviaQuestion[];
}

export interface ITriviaQuestion {
  _id: ObjectId;
  text: string;
  answer: string;
  difficulty: number;
}

export interface Payment {
  reference: string;
  status: "pending" | "paid" | "failed";
  user?: string;
  wallet?: string;
  gameId: ObjectId;
}
