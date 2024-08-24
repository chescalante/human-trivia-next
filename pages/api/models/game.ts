import mongoose, { Schema, Document, Model } from "mongoose";

interface IGame extends Document {
  active: boolean;
  startDate: Date;
  finishDate: Date;
  winners: string[]; //userIds
  prizePool: number;
  playersCount: number;
  ticketPrice: number;
  // fee: number; //Should be an env var but don't forget your piece of cake
}

const GameSchema: Schema<IGame> = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  finishDate: {
    type: Date,
    required: true,
  },
  winners: {
    type: [String],
    required: true,
  },
  prizePool: {
    type: Number,
    required: true,
  },
  playersCount: {
    type: Number,
    required: true,
  },
});

const Game: Model<IGame> =
  mongoose.models.Game || mongoose.model<IGame>("Game", GameSchema);

export default Game;
export type { IGame };
