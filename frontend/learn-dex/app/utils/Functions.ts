import { writeContract, readContract } from "@wagmi/core";
import { config } from "./config";
import { FactoryABI } from "./factoryABI.json";
import { WETHABI } from "./WETHABI.json";

export async function createPair(token1Address: string, token2Address: string) {
  try {
    const createPair = await writeContract(config, {
      abi: FactoryABI,
      address: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
      functionName: "createPair",
      args: [token1Address, token2Address],
    });
    console.log("Create Pair: ", createPair);
  } catch (error) {
    console.error(error);
  }
}

export async function getPair(token1Address: string, token2Address: string) {
  try {
    const pair = await readContract(config, {
      abi: FactoryABI,
      address: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
      functionName: "getPair",
      args: [token1Address, token2Address],
    });
    console.log("Pair: ", pair);
  } catch (error) {
    console.error(error);
  }
}

export async function getAllPairsLength() {
  try {
    const allPairsLength = await readContract(config, {
      abi: FactoryABI,
      address: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
      functionName: "allPairsLength",
    });
    console.log("All Pairs Length: ", allPairsLength);
  } catch (error) {
    console.error(error);
  }
}

// Bu fonksiyon for döngüsü içinde çağırılmalı.
export async function getAllPairs(
  index: number,
  setPairs: any,
  pairAddress: string
) {
  try {
    const allPairs = await readContract(config, {
      abi: FactoryABI,
      address: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
      functionName: "allPairs",
      args: [index],
    });
    console.log("All Pairs: ", allPairs);
    setPairs((prevPairs: any) => [...prevPairs, pairAddress]);
  } catch (error) {
    console.error(error);
  }
}

export async function Approve(tokenAddress: string, V2RouterAddress: string) {
  const uintMax = 200000000000000000;

  async function isValidAddress(tokenAddress: string) {
    return /^0x[a-fA-F0-9]{40}$/.test(tokenAddress);
  }

  if (!isValidAddress(tokenAddress)) {
    alert("Invalid Token Address");
    return;
  }

  try {
    const approve = await writeContract(config, {
      abi: WETHABI,
      address: tokenAddress,
      functionName: "approve",
      args: [V2RouterAddress, uintMax],
    });
  } catch (error) {
    console.error(error);
  }
}
