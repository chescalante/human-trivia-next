import mongoose from "mongoose";

const MONGO_URI = process.env.DB_URL as string;

if (!MONGO_URI) {
  throw new Error(
    "Please define the MONGO_URI environment variable inside .env.local"
  );
}

export const connectMongo = async (): Promise<typeof mongoose> => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose;
  }

  return mongoose.connect(MONGO_URI);
};
