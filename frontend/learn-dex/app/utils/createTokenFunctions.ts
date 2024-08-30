import { LaunchPadABI } from "./LaunchPadABI.json";
import { writeContract, readContract } from "@wagmi/core";
import { config } from "./config";
import { getAccount } from "@wagmi/core";

const launchPadAddress = "0x204669a271Db91f21b7e4818Fe79d7a8974B611B";

export async function createToken(tokenName: string, tokenSymbol: string) {
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

// Tüm tokenların bilgilerini dönüyor
export async function getTokenInfo(
  setTokenInfo: (tokenInfo: TokenInfo[]) => void
) {
  try {
    const [tokenAddresses, mintedBys, names, symbols] = await readContract(
      config,
      {
        abi: LaunchPadABI,
        address: launchPadAddress,
        functionName: "getTokenInfo",
      }
    );

    const tokens: TokenInfo[] = names.map((name: string, index: number) => ({
      tokenAddress: tokenAddresses[index],
      mintedBy: mintedBys[index],
      name,
      symbol: symbols[index],
    }));

    setTokenInfo(tokens);
    console.log("Token Info fonksiyonun içindeki ", tokens);
  } catch (error) {
    console.log(error);
  }
}

// Kullanıcının token adreslerini ve isimlerini/simbol bilgilerini dönüyor
export async function getUserTokens(
  setUserTokens: (userTokens: { name: string; symbol: string }[]) => void
) {
  const account = getAccount(config);
  try {
    const [names, symbols] = await readContract(config, {
      abi: LaunchPadABI,
      address: launchPadAddress,
      functionName: "getUserTokens",
      args: [account.address],
    });

    const userTokens = names.map((name: string, index: number) => ({
      name,
      symbol: symbols[index],
    }));

    setUserTokens(userTokens);
    console.log("User Tokens ", userTokens);
  } catch (error) {
    console.log(error);
  }
}

export async function mintToken(tokenAddress: string) {
  try {
    const mintedToken = await writeContract(config, {
      abi: LaunchPadABI,
      address: launchPadAddress,
      functionName: "mintToken",
      args: [tokenAddress],
    });
    console.log("Minted Token " + mintedToken);
  } catch (error) {
    console.log(error);
  }
}
