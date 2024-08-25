import { MiniKit } from "@worldcoin/minikit-js";
import Layout from "../components/layout";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function IndexPage() {
  return (
    <Layout>
      <div className="h-full flex flex-col justify-between p-4 ">
        <div className="flex flex-col gap-16 ">
          <div
            className="card bg-white "
            style={{ border: "1px solid #9C9DA2" }}
          >
            <div className="card-body flex justify-between gap-8 p-6 mx-1">
              <Image
                src="/images/ht-logo.svg" // Path relative to the public directory
                alt="Description of image"
                className="m-auto"
                width={150}
                height={300}
              />
              <div>
                <div className="text-3xl text-center font-semibold">
                  Trivia Quiz Diario
                </div>
                <div
                  className="text-lg text-center text-gray-400 mt-2"
                  style={{ lineHeight: "1.2rem" }}
                >
                  Usá tus conocimientos para responder las preguntas y ganar
                  $1.000.000!
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-primary text-primary w-full">
            <div className="card-body gap-4">
              <div className="text-2xl font-thin text-white">Worldcoin</div>
              <div>
                <div className="flex gap-2 justify-center align-baseline">
                  <Image
                    src="/images/icon-wld.svg" // Path relative to the public directory
                    alt="Description of image"
                    width={30}
                    height={30}
                  />
                  <div className="text-5xl text-center font-semibold text-white">
                    1.00 WLD
                  </div>
                </div>
                <div className="text-lg text-center font-thin text-gray-300">
                  ~ $2.340 ARS
                </div>
              </div>
            </div>
          </div>
        </div>
        <button className="btn btn-primary text-lg">Aceptar y jugar</button>
      </div>
    </Layout>
  );
}
