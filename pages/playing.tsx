import Image from "next/image";
import Layout from "../components/layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const SECONDS_TO_WAIT = 5;
const UPDATE_INTERVAL = 10; // Update every 100ms

export default function Playing() {
  const [count, setCount] = useState(SECONDS_TO_WAIT);
  const [radialValue, setRadialValue] = useState(100); // Start at 100% for the radial progress
  const router = useRouter();

  return (
    <Layout>
      <div className="h-full flex flex-col justify-center items-center p-4">
        PLAYING
      </div>
    </Layout>
  );
}
