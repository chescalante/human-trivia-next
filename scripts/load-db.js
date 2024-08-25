import * as fs from "fs";
import csvParser from "csv-parser";
import { connectMongo } from "../lib/mongodb";

async function loadQuestionsFromCSV() {
  const questions = [];
  const db = await connectMongo();
  fs.createReadStream("./questions.csv")
    .pipe(csvParser())
    .on("data", (row) => {
      const question = {
        text: row["Pregunta"],
        correctAnswer: row[`Opción ${row["Correcta"]}`],
        difficulty: row["Nivel"],
        options: [row["Opción A"], row["Opción B"], row["Opción C"]],
      };
      questions.push(question);
    })
    .on("end", async () => {
      try {
        await questionsCollection.insertMany(questions);
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
