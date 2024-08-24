import { writeContract, readContract } from "@wagmi/core";
import { V2Router02ABI } from "./V2RouterABI.json";
import { WETHABI } from "./WETHABI.json";
import { config } from "./config";
import { parseUnits, formatUnits } from "viem";
import { getAccount } from "@wagmi/core";

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

export async function getBalance(
  tokenAddress: string,
  setBalance: any,
  poolAddress: string
) {
  console.log("Fetching balance for token:", tokenAddress, "in pool:", poolAddress);
  const decimal = 18;
  try {
    const balance = await readContract(config, {
      abi: WETHABI,
      address: tokenAddress,
      functionName: "balanceOf",
      args: [poolAddress],
    });
    setBalance(Number(formatUnits(balance as bigint, decimal)));
  } catch (error) {
    console.error("Error fetching balance:", error);
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
  const account = getAccount(config);
  if (!account || !account.address) {
    console.error("Account not found or address is invalid.");
    return;
  }
  const accountAddress = account.address;
  console.log("Token1 Address: ", token1Address);
  console.log("Token2 Address: ", token2Address);
  const parsedAmount1 = parseUnits(amountToken1, token1Decimals);
  const parsedAmount2 = parseUnits(amountToken2, token2Decimals);
  console.log("Parsed Amount 1:", parsedAmount1.toString());
  console.log("Parsed Amount 2:", parsedAmount2.toString());
  console.log("accountAddress: " + accountAddress);
  const address = "0x9d67063E8FAC73b17C91Bf891d94105216Cda56e";
  try {
    const addLiquidity = await writeContract(config, {
      abi: V2Router02ABI,
      address: address,
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
    console.error("Error adding liquidity:", (error as Error).message || error);
  }
}

export async function removeLiquidity(
  token1Address: string,
  token2Address: string,
  amountRemoveLiquidity: number
) {
  const account = getAccount(config);
  if (!account || !account.address) {
    console.error("Account not found or address is invalid.");
    return;
  }
  const accountAddress = account.address;
  try {
    const removeLiquidity = await writeContract(config, {
      abi: V2Router02ABI,
      address: "0x9d67063E8FAC73b17C91Bf891d94105216Cda56e",
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
