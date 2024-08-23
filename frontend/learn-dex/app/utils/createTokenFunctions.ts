import { LaunchPadABI } from "./LaunchPadABI.json";
import { writeContract, readContract } from "@wagmi/core";
import { config } from "./config";
import { getAccount } from "@wagmi/core";

export async function createToken(tokenName: string, tokenSymbol: string) {
  const launchPadAddress = "0xfABEb71c5590d6296BA7C3294622BFB6902f8590";
  try {
    const deployedToken = await writeContract(config, {
      abi: LaunchPadABI,
      address: launchPadAddress,
      functionName: "deployToken",
      args: [tokenName, tokenSymbol],
    });
    console.log("Deployed Token " + deployedToken);
  } catch (error) {
    console.log(error);
  }
}

// tüm tokenların bilgilerini dönüyor
export async function getTokenInfo() {
  try {
    const tokenInfo = await readContract(config, {
      abi: LaunchPadABI,
      address: "0xfABEb71c5590d6296BA7C3294622BFB6902f8590",
      functionName: "getTokenInfo",
    });
    console.log("Token Info " + tokenInfo);
  } catch (error) {
    console.log(error);
  }
}

// token adreslerini dönüyor
export async function getUserTokens() {
  const account = getAccount(config);
  try {
    const userTokens = await readContract(config, {
      abi: LaunchPadABI,
      address: "0xfABEb71c5590d6296BA7C3294622BFB6902f8590",
      functionName: "getUserTokens",
      args: [account.address],
    });
    console.log("User Tokens " + userTokens);
  } catch (error) {
    console.log(error);
  }
}

// basılan tokenların indexine göre bilgilerini dönüyor
export async function tokens(index: number) {
    try {
        const tokenInfo = await readContract(config, {
            abi: LaunchPadABI,
            address: "0xfABEb71c5590d6296BA7C3294622BFB6902f8590",
            functionName: "tokens",
            args: [index],
        });
        console.log("Token Info(tokens) " + tokenInfo);
    } catch (error) {
        console.log(error);
    }
}
