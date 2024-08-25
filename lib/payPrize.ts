import {
  createPublicClient,
  http,
  erc20Abi,
  parseUnits,
  createWalletClient,
  getContract,
  Address,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { optimism } from "viem/chains";

const WLD_COIN_TOKEN_CONTRACT = "0xdC6fF44d5d932Cbd77B52E5612Ba0529DC6226F1";
const WLD_COIN_TOKEN_DECIMALS = 18;

const paymentAccount = privateKeyToAccount(
  process.env.PAYMENT_ACCOUNT_PRIVATE_KEY as any
);

// Setup the public client
const publicClient = createPublicClient({
  chain: optimism,
  transport: http(),
});

// Setup the wallet client
const walletClient = createWalletClient({
  account: paymentAccount,
  chain: optimism,
  transport: http(),
});

export default async function payPrize(toAddress: string, amount: number) {
  // Prepare the transaction
  const amountInWei = parseUnits(
    amount.toString(),
    WLD_COIN_TOKEN_DECIMALS
  ).toString();

  const { request: transferRequest } = await publicClient.simulateContract({
    address: WLD_COIN_TOKEN_CONTRACT,
    abi: erc20Abi,
    functionName: "transfer",
    args: [toAddress as Address, BigInt(amountInWei)],
    account: paymentAccount,
  });

  const tx = await walletClient.writeContract(transferRequest);

  return tx;
}
