import { writeContract, readContract } from "@wagmi/core";
import { config } from "./config";
import { FactoryABI } from "./factoryABI.json";
import { WETHABI } from "./WETHABI.json";
import { getAccount } from "@wagmi/core";

export async function createPair(token1Address: string, token2Address: string) {
  try {
    const createPair = await writeContract(config, {
      abi: FactoryABI,
      address: "0x550F5925cADF71086bdCE274ceA5779F67f57C42",
      functionName: "createPair",
      args: [token1Address, token2Address],
    });
    console.log("Create Pair: ", createPair);
  } catch (error) {
    console.error(error);
  }
}

export async function getPair(
  token1Address: string,
  token2Address: string,
  setPair: any
) {
  try {
    const pair = await readContract(config, {
      abi: FactoryABI,
      address: "0x550F5925cADF71086bdCE274ceA5779F67f57C42",
      functionName: "getPair",
      args: [token1Address, token2Address],
    });
    console.log("Pair: ", pair);
    setPair(pair);
    return pair;
  } catch (error) {
    console.error(error);
  }
}

export async function getAllPairsLength() {
  try {
    const allPairsLength = await readContract(config, {
      abi: FactoryABI,
      address: "0x550F5925cADF71086bdCE274ceA5779F67f57C42",
      functionName: "allPairsLength",
    });
    console.log("All Pairs Length: ", allPairsLength);
  } catch (error) {
    console.error(error);
  }
}

// Bu fonksiyon for döngüsü içinde çağırılmalı.
export async function getAllPairs(index: number) {
  try {
    const allPairs = await readContract(config, {
      abi: FactoryABI,
      address: "0x550F5925cADF71086bdCE274ceA5779F67f57C42",
      functionName: "allPairs",
      args: [index],
    });
    console.log("All Pairs: ", allPairs);
  } catch (error) {
    console.error(error);
  }
}

export async function Approve(tokenAddress: string) {
  const uintMax = 200000000000000000;
  const V2RouterAddress = "0x9d67063E8FAC73b17C91Bf891d94105216Cda56e";

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
