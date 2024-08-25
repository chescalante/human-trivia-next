import Image from "next/image";
import Layout from "../components/layout";
import { useState } from "react";
import { useRouter } from "next/router";
import questionAnimation from "../public/images/question-animation.json";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const SECONDS_TO_WAIT = 5;
const UPDATE_INTERVAL = 10; // Update every 100ms

export default function Playing() {
  const [count, setCount] = useState(SECONDS_TO_WAIT);
  const [radialValue, setRadialValue] = useState(100); // Start at 100% for the radial progress
  const router = useRouter();

  const options = {
    animationData: questionAnimation,
    loop: true,
  };

  return (
    <Layout>
      <div className="h-full flex flex-col p-4 justify-between">
        <div className="flex gap-2 justify-between items-center">
          <Image
            src="/images/settings.svg" // Path relative to the public directory
            alt="Description of image"
            width={40}
            height={40}
          />
          <span className="countdown font-mono text-3xl text-black">
            {/* @ts-ignore */}
            <span style={{ "--value": 1 }}></span>
          </span>
          <Image
            src="/images/right-arrow.svg" // Path relative to the public directory
            alt="Description of image"
            width={40}
            height={40}
            onClick={() => router.push("/")}
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
            <div className="text-3xl text-center font-bold ">
              ¿Qué país es el mayor exportador de vainilla en el mundo?
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center gap-8">
          <button
            className="btn btn-primary text-lg w-full"
            onClick={() => router.push("/play")}
          >
            OP1
          </button>
          <button
            className="btn btn-primary text-lg w-full"
            onClick={() => router.push("/play")}
          >
            OP2
          </button>
          <button
            className="btn btn-primary text-lg w-full"
            onClick={() => router.push("/play")}
          >
            OP3
          </button>
        </div>
      </div>
    </Layout>
  );
}
