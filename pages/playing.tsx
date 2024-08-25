import Image from "next/image";
import Layout from "../components/layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import questionAnimation from "../public/images/question-animation.json";
import dynamic from "next/dynamic";
import MyModal from "../components/modal";
import axios from "axios";
import { Question } from "./api/models/types";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const SECONDS_TO_WAIT = 5;
const UPDATE_INTERVAL = 10; // Update every 100ms

export default function Playing() {
  const [count, setCount] = useState(SECONDS_TO_WAIT);
  const [radialValue, setRadialValue] = useState(100); // Start at 100% for the radial progress
  const router = useRouter();
  const [question, setQuestion] = useState(""); // State to store the question
  const [answers, setAnswers] = useState([]); // State to store the answer options
  const [questionData, setQuestionData] = useState<Question | null>(null); // Using the Question interface

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get<{ question: Question }>(
          "/api/question"
        );
        setQuestionData(response.data.question);
      } catch (error) {
        console.error("Failed to fetch the question:", error);
      }
    };

    fetchQuestion();
  }, []);
  
  useEffect(() => {
    if (count >= 0) {
      const interval = setInterval(() => {
        setCount((prevCount) => prevCount - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      // @ts-ignore
      document.getElementById("my_modal_5")?.showModal();
    }
  }, [count]);

  return (
    <Layout>
      <div
        className="flex flex-col p-4 justify-between"
        style={{ height: "90vh" }}
      >
        <div className="flex gap-2 justify-between items-center">
          <Image
            src="/images/right-arrow.svg" // Path relative to the public directory
            alt="Description of image"
            width={40}
            height={40}
            onClick={() => router.push("/")}
          />
          <span className="countdown font-mono text-3xl text-black">
            {/* @ts-ignore */}
            <span style={{ "--value": count }}></span>
          </span>
          <Image
            src="/images/settings.svg" // Path relative to the public directory
            alt="Description of image"
            width={40}
            height={40}
          />
        </div>
        <div>
          <Lottie
            animationData={questionAnimation}
            className="flex justify-center items-center h-28"
            loop={true}
          />
          <div>
            <div className="text-2xl text-gray-400 text-center mt-8 mb-2">
              1/ 12
            </div>
            <div className="text-3xl text-center font-bold ">{question}</div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center gap-8">
          <div className="flex flex-col justify-center items-center gap-8">
            {questionData?.options.length ? (
              questionData.options.map((option: string, index: number) => (
                <button
                  key={index}
                  className="btn btn-primary text-lg w-full"
                  onClick={() => router.push("/play")}
                >
                  {option}
                </button>
              ))
            ) : (
              <p>Loading answers...</p>
            )}
          </div>
        </div>
      </div>
      <MyModal />
    </Layout>
  );
}
