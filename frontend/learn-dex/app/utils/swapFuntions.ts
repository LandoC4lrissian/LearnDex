import { writeContract, readContract } from "@wagmi/core";
import { config } from "./config";
import { getAccount } from "@wagmi/core";
import { parseEther } from "viem";
import { FactoryABI } from "./factoryABI.json";
import { WETHABI } from "./WETHABI.json";
import { V2Router02ABI } from "./V2RouterABI.json";

const deadline = Number(Math.floor(new Date().getTime() / 1000.0) + "0");

export async function getTokenDecimal(token1Address: string, setDecimal: any) {
  try {
    const decimals = await readContract(config, {
      abi: WETHABI,
      address: token1Address,
      functionName: "decimals",
    });
    console.log("Token1 Decimal: ", decimals);
    setDecimal(Number(decimals));
  } catch (error) {
    console.error(error);
  }
}

export async function swapExactETHForTokens(
  amountIn: string,
  token1address: string,
  token2address: string
) {
  const account = getAccount(config);
  if (!account || !account.address) {
    console.error("Account not found or address is invalid.");
    return;
  }
  const accountAddress = account.address;
  try {
    const swapExactETHForTokens = await writeContract(config, {
      abi: V2Router02ABI,
      address: "0x9d67063E8FAC73b17C91Bf891d94105216Cda56e",
      functionName: "swapExactETHForTokens",
      value: parseEther(amountIn),
      args: [[0], [token1address, token2address], accountAddress, deadline],
    });
    console.log("Swap Exact ETH For Tokens: ", swapExactETHForTokens);
  } catch (error) {
    console.error(error);
  }
}

export async function swapExactTokensForTokens(
  token1Address: string,
  token2Address: string,
  amountIn: string
) {
  const amountInParsed = BigInt((Number(amountIn) * 10 ** 18).toString());
  const account = getAccount(config);
  if (!account || !account.address) {
    console.error("Account not found or address is invalid.");
    return;
  }
  const accountAddress = account.address;
  try {
    const swapExactTokensForToken = await writeContract(config, {
      abi: V2Router02ABI,
      address: "0x9d67063E8FAC73b17C91Bf891d94105216Cda56e",
      functionName: "swapExactTokensForTokens",
      args: [
        amountInParsed,
        0,
        [token1Address, token2Address],
        accountAddress,
        deadline,
      ],
    });
    console.log("Swap Exact Tokens For Token: ", swapExactTokensForToken);
  } catch (error) {
    console.error(error);
  }
}
