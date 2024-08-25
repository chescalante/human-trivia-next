import {
  MiniKit,
  tokenToDecimals,
  Tokens,
  PayCommandInput,
} from "@worldcoin/minikit-js";

export default function Pay() {
  const sendPayment = async () => {
    const res = await fetch("/api/payments/initiate-payment", {
      method: "POST",
    });
    const { id } = await res.json();

    const payload: PayCommandInput = {
      reference: id,
      to: "0xd59664CD61db33814fBe16Eb96fd0bf00de39f7d",
      tokens: [
        {
          symbol: Tokens.WLD,
          token_amount: tokenToDecimals(1, Tokens.WLD).toString(),
        },
      ],
      description: "Pagá tu entrada para el desafío diario y ganá",
    };

    if (MiniKit.isInstalled()) {
      MiniKit.commands.pay(payload);
    }
  };

  return (
    <button className="btn btn-primary text-lg" onClick={sendPayment}>
      Aceptar y jugar
    </button>
  );
}
