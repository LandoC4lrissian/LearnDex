import { writeContract, readContract } from "@wagmi/core";
import { config } from "./config";
import { getAccount } from "@wagmi/core";
import { parseEther } from "viem";
import { FactoryABI } from "./factoryABI.json";
import { WETHABI } from "./WETHABI.json";
import { V2Router02ABI } from "./V2RouterABI.json";

const deadline = Number(Math.floor(new Date().getTime() / 1000.0) + "0");
const account = getAccount(config);
const accountAddress = account?.address || "";

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
  try {
    const swapExactETHForTokens = await writeContract(config, {
      abi: V2Router02ABI,
      address: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
      functionName: "swapExactETHForTokens",
      value: parseEther(amountIn),
      args: [[0], [token1address, token2address], accountAddress, deadline],
    });
    console.log("Swap Exact ETH For Tokens: ", swapExactETHForTokens);
  } catch (error) {
    console.error(error);
  }
}

export async function swapExactTokensForETH(
  token1Address: string,
  token2Address: string,
  amountIn: string,
  decimal: number
) {
  const amountInParsed = BigInt((Number(amountIn) * 10 ** decimal).toString());
  try {
    const swapExactTokensForETH = await writeContract(config, {
      abi: V2Router02ABI,
      address: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
      functionName: "swapExactTokensForETH",
      args: [
        amountInParsed,
        0,
        [token1Address, token2Address],
        accountAddress,
        deadline,
      ],
    });
    console.log("Swap Exact Tokens For ETH: ", swapExactTokensForETH);
  } catch (error) {
    console.error(error);
  }
}
