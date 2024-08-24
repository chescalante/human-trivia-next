import mongoose, { Schema, Document, Model } from "mongoose";

interface ITrivia extends Document {
  user: string;
  gameId: string;
  triviaStatus: "success" | "running";
  questions: ITriviaQuestion[];
}

interface ITriviaQuestion {
  text: string;
  answer: string;
  difficulty: number;
  success: boolean;
  correctAnswer: string;
}

const TriviaQuestionSchema: Schema<ITriviaQuestion> = new Schema({
  text: { Type: String, required: true },
  answer: { Type: String, required: true },
  difficulty: { Type: Number, required: true },
  success: { Type: Boolean, required: true },
});

const TriviaSchema: Schema<ITrivia> = new Schema({
  gameId: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: String,
    required: true,
  },
  triviaStatus: {
    type: String,
    required: true,
  },
  questions: {
    type: [TriviaQuestionSchema],
    required: true,
  },
});

const Trivia: Model<ITrivia> =
  mongoose.models.Trivia || mongoose.model<ITrivia>("Trivia", TriviaSchema);

export default Trivia;
export type { ITrivia };
