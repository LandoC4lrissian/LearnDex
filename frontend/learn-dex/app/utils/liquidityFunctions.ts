import { writeContract, readContract } from "@wagmi/core";
import { V2Router02ABI } from "./V2RouterABI.json";
import { WETHABI } from "./WETHABI.json";
import { config } from "./config";
import { parseUnits, formatUnits } from "viem";
import { getAccount } from "@wagmi/core";

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

export async function getBalance(
  address: string,
  setBalance: any,
  decimal: number,
  poolAddress: string
) {
  try {
    const balance = await readContract(config, {
      abi: WETHABI,
      address: address,
      functionName: "balanceOf",
      args: [poolAddress],
    });
    setBalance(Number(formatUnits(balance as bigint, decimal)));
  } catch (error) {
    console.error(error);
  }
}

export async function addLiquidity(
  token1Address: string,
  token2Address: string,
  amountToken1: string,
  amountToken2: string,
  token1Decimals: number,
  token2Decimals: number
) {
  try {
    const addLiquidity = await writeContract(config, {
      abi: V2Router02ABI,
      address: "0x63656d7917FcBaAd1A4A75a048da32778C695eD3",
      functionName: "addLiquidity",
      args: [
        token1Address,
        token2Address,
        parseUnits(amountToken1, token1Decimals),
        parseUnits(amountToken2, token2Decimals),
        0,
        0,
        accountAddress,
        deadline,
      ],
    });
    console.log("Add Liquidity " + addLiquidity);
  } catch (error) {
    console.error(error);
  }
}

export async function removeLiquidity(
  token1Address: string,
  token2Address: string,
  amountRemoveLiquidity: number
) {
  try {
    const removeLiquidity = await writeContract(config, {
      abi: V2Router02ABI,
      address: "0x63656d7917FcBaAd1A4A75a048da32778C695eD3",
      functionName: "removeLiquidity",
      args: [
        token1Address,
        token2Address,
        amountRemoveLiquidity,
        0,
        0,
        accountAddress,
        deadline,
      ],
    });
    console.log("Remove Liquidity " + removeLiquidity);
  } catch (error) {
    console.error(error);
  }
}
