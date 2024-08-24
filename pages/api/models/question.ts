import mongoose, { Schema, Document, Model } from "mongoose";

interface IQuestion extends Document {
  text: string;
  correctAnswer: string;
  difficulty: number;
  options: string[];
}

const QuestionSchema: Schema<IQuestion> = new Schema({
  text: {
    type: String,
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  difficulty: {
    type: Number,
    required: true,
  },
  options: {
    type: [String],
    required: true,
    unique: true,
  },
});

const Question: Model<IQuestion> =
  mongoose.models.Question ||
  mongoose.model<IQuestion>("Question", QuestionSchema);

export default Question;
export type { IQuestion };
