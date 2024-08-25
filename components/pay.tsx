import {
  MiniKit,
  tokenToDecimals,
  Tokens,
  PayCommandInput,
  ResponseEvent,
  MiniAppPaymentPayload,
} from "@worldcoin/minikit-js";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Pay() {
  const router = useRouter();
  const [isInstalled, setIsInstalled] = useState(false)

  const sendPayment = async () => {
    const res = await fetch("/api/payments/initiate-pay", {
      method: "POST",
    });
    const { id } = await res.json();

    const payload: PayCommandInput = {
      reference: id,
      to: "0xd59664CD61db33814fBe16Eb96fd0bf00de39f7d",
      tokens: [
        {
          symbol: Tokens.WLD,
          token_amount: tokenToDecimals(0.1, Tokens.WLD).toString(),
        },
      ],
      description: "Pagá tu entrada para el desafío diario y ganá",
    };

    if (MiniKit.isInstalled()) {
      MiniKit.commands.pay(payload);
    }
  };

  useEffect(() => {
    if (!MiniKit.isInstalled()) {
      console.error("MiniKit is not installed");
      return;
    }

    console.log("before subscribe")
    MiniKit.subscribe(
      ResponseEvent.MiniAppPayment,
      async (response: MiniAppPaymentPayload) => {
        console.log("response: ", response)
        if (response.status == "success") {
          console.log("success!")
          const res = await fetch(`/api/payments/confirm-pay`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          console.log("before-payment")
          const payment = await res.json();
          console.log("payment: ", payment)
          if (payment.success) {
            console.log("wtf?")
            router.push("/play");
          }
        }
      }
    );

    return () => {
      MiniKit.unsubscribe(ResponseEvent.MiniAppPayment);
    };
  }, []);

  return (
    <button className="btn btn-primary text-lg" onClick={sendPayment}>
      Aceptar y jugar
    </button>
  );
}
