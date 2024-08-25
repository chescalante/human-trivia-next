import { Db, MongoClient } from "mongodb";

const MONGO_URI = process.env.DB_URL as string;

if (!MONGO_URI) {
  throw new Error(
    "Please define the MONGO_URI environment variable inside .env.local"
  );
}

export const connectMongo = async () => {
  const client = new MongoClient(MONGO_URI);
  await client.connect();

  // Specify the database and collection
  const database: Db = client.db("test");
  return database;
};
