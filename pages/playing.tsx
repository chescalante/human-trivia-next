import Image from "next/image";
import Layout from "../components/layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import questionAnimation from "../public/images/question-animation.json";
import dynamic from "next/dynamic";
import MyModal from "../components/modal";
import axios from "axios";
import { Question } from "./api/models/types";
import SuccessModal from "../components/successModal";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const SECONDS_TO_WAIT = 45;
const UPDATE_INTERVAL = 10; // Update every 100ms

export default function Playing() {
  const [count, setCount] = useState(SECONDS_TO_WAIT);
  const [radialValue, setRadialValue] = useState(100); // Start at 100% for the radial progress
  const router = useRouter();
  const [question, setQuestion] = useState(1); // State to store the question
  const [answers, setAnswers] = useState([]); // State to store the answer options
  const [questionData, setQuestionData] = useState<Question | null>(null); // Using the Question interface
  const [loading, setLoading] = useState(false);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        const response2 = await axios.get<{ question: Question }>(
          "/api/trivia/join"
        );
        const response = await axios.get<Question>("/api/question/get");
        setLoading(false);
        console.log("question: ", response.data);
        setQuestionData(response.data);
      } catch (error) {
        console.error("Failed to fetch the question:", error);
      }
    };

    fetchQuestion();
  }, [question]);

  useEffect(() => {
    if (count >= 0) {
      const interval = setInterval(() => {
        setCount((prevCount) => prevCount - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      // @ts-ignore
      /*  if (!answered) {
        document.getElementById("my_modal_5")?.showModal();
      } */
    }
  }, [count]);

  const sendAnswer = async (answer: string) => {
    try {
      const res = await axios.post("/api/question/answer", {
        answer: answer,
      });
      console.log("question: ", res.data);
      setAnswered(true);
      /* setQuestion(question + 1);
      setCount(SECONDS_TO_WAIT); */
      if (question === 3) {
        document.getElementById("my_modal_5")?.showModal();
      } else {
        // @ts-ignore
        document.getElementById("my_modal_success")?.showModal();
      }
    } catch (error) {
      console.error("Failed to fetch the question:", error);
    }
  };
  if (loading) {
    return (
      <Layout>
        <div
          className="flex flex-col p-4 justify-between"
          style={{ height: "90vh" }}
        >
          <div className="loading loading-spinner loading-lg m-auto text-black mt-auto" />
        </div>
      </Layout>
    );
  }
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
            loop={false}
          />
          <div>
            <div className="text-2xl text-gray-400 text-center mt-8 mb-2">
              {question}/ 12
            </div>
            <div className="text-2xl text-center font-bold ">
              {questionData?.text}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center gap-8">
          <div className="flex flex-col justify-center items-center gap-8 w-full">
            {questionData?.options.length ? (
              questionData.options.map((option: string, index: number) => (
                <button
                  key={index}
                  className="btn btn-primary text-lg w-full"
                  onClick={() => sendAnswer(option)}
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
      <SuccessModal
        callback={() => {
          setQuestion(question + 1);
          setCount(SECONDS_TO_WAIT);
          document.getElementById("my_modal_success")?.close();
        }}
      />
    </Layout>
  );
}
