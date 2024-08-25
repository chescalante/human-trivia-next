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
import { createPublicClient, http, parseAbiItem } from "viem";
import { optimism } from "viem/chains";

export default function Pay() {
  const [paymentId, setPaymentId] = useState();
  const router = useRouter();

  const sendPayment = async () => {
    const res = await fetch("/api/payments/initiate-pay", {
      method: "POST",
    });
    const { id } = await res.json();
    setPaymentId(id);

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

  const publicClient = createPublicClient({
    chain: optimism,
    transport: http()
  })

  const WLD_COIN_TOKEN_CONTRACT = "0xdC6fF44d5d932Cbd77B52E5612Ba0529DC6226F1";
  const unwatch = publicClient.watchEvent({
    address: WLD_COIN_TOKEN_CONTRACT,
    event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)'),
    args: {
      to: '0xd59664CD61db33814fBe16Eb96fd0bf00de39f7d',
    },
    onLogs: (logs) => {
      logs.forEach(x => {
        fetch(`/api/payments/confirm-pay`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transactionHash: x.transactionHash, reference: paymentId }),
        }).then(x => x.json())
          .then(x => { if (x.success) router.push("/play"); }); x.transactionHash
      }); router.push(" /play");
    }
  })

  useEffect(() => {
    // Minikit evenbt subscribe failing
    // Workaround with blockchain watcher.

    // if (!MiniKit.isInstalled()) {
    //   console.error("MiniKit is not installed");
    //   return;
    // }

    // MiniKit.subscribe(
    //   ResponseEvent.MiniAppPayment,
    //   (response: MiniAppPaymentPayload) => {
    //     if (response.status == "success") {
    //       fetch(`/api/payments/confirm-pay`, {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify(response),
    //       }).then(x => x.json())
    //         .then(x => { if (x.success) router.push("/play"); });
    //     }
    //   }
    // );

    // return () => {
    //   MiniKit.unsubscribe(ResponseEvent.MiniAppPayment);
    // };
    return () => {
      unwatch();
    }
  }, []);

  return (
    <button className="btn btn-primary text-lg" onClick={sendPayment}>
      Aceptar y jugar
    </button>
  );
}


function watcher() {

}