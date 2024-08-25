import Image from "next/image";
import Layout from "../components/layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const SECONDS_TO_WAIT = 1;
const UPDATE_INTERVAL = 10; // Update every 100ms

export default function Play() {
  const [count, setCount] = useState(SECONDS_TO_WAIT);
  const [radialValue, setRadialValue] = useState(100); // Start at 100% for the radial progress
  const router = useRouter();

  useEffect(() => {
    let totalTime = SECONDS_TO_WAIT * 1000; // Convert to milliseconds
    let timePassed = 0;

    const interval = setInterval(() => {
      timePassed += UPDATE_INTERVAL;
      const newRadialValue = ((totalTime - timePassed) / totalTime) * 100;
      setRadialValue(newRadialValue);

      // Update the count every 1000ms (1 second)
      if (timePassed % 1000 === 0) {
        setCount((prevCount) => prevCount - 1);
      }

      // Stop when the time has passed
      if (timePassed >= totalTime) {
        clearInterval(interval);
        // Navigate to the desired route
        router.push("/playing");
      }
    }, UPDATE_INTERVAL);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [router]);

  return (
    <Layout>
      <div className="h-full flex flex-col justify-center items-center p-4">
        <div
          className="radial-progress"
          style={{
            // @ts-ignore
            "--value": radialValue,
            color: "#42CBFF",
            "--size": "16rem",
          }}
          role="progressbar"
        >
          <span className="countdown font-mono text-5xl text-black">
            {/*  @ts-ignore */}
            <span style={{ "--value": count }}></span>
          </span>
        </div>
      </div>
    </Layout>
  );
}
