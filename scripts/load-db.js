import * as fs from "fs";
import csvParser from "csv-parser";
import { MongoClient } from "mongodb";

//Change package.json type to momdule so that this works
//It doesn't allow import actually

const connectMongo = async () => {
  const client = new MongoClient(
    "mongodb+srv://chescalantear:aN2QG1LpD451bIaN@humantriviacluster0.ojnhw.mongodb.net/"
  );
  await client.connect();

  // Specify the database and collection
  const database = client.db("test");
  return database;
};

async function loadQuestionsFromCSV() {
  const questions = [];
  const db = await connectMongo();
  fs.createReadStream("./questions.csv")
    .pipe(csvParser())
    .on("data", (row) => {
      const question = {
        text: row["Pregunta"],
        correctAnswer: row[`Opción ${row["Correcta"]}`],
        difficulty: +row["Nivel"],
        options: [row["Opción A"], row["Opción B"], row["Opción C"]],
      };
      questions.push(question);
    })
    .on("end", async () => {
      try {
        await db.collection("questions").insertMany(questions);
        console.log("Questions loaded successfully");
      } catch (error) {
        console.error("Error inserting questions:", error);
      }
    });
}
async function main() {
  await loadQuestionsFromCSV();
}
main().catch((err) => console.error(err));
