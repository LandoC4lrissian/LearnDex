"use client";
import React, { useState, useEffect } from "react";
import {
  createToken,
  getTokenInfo,
  getUserTokens,
  mintToken,
} from "../utils/createTokenFunctions";
import { motion } from "framer-motion";
import { config } from "../utils/config";
import { writeContract, readContract } from "@wagmi/core";
import { WETHABI } from "../utils/WETHABI.json";
import { getAccount } from "@wagmi/core";

interface TokenInfo {
  tokenAddress: string;
  mintedBy: string;
  name: string;
  symbol: string;
}

const CreateToken = () => {
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenInfo, setTokenInfo] = useState<TokenInfo[]>([]);
  const [userTokens, setUserTokens] = useState<
    { name: string; symbol: string }[]
  >([]);
  const [isCreatePopupVisible, setIsCreatePopupVisible] = useState(false);
  const [isMintPopupVisible, setIsMintPopupVisible] = useState(false);
  const [isUserTokensPopupVisible, setIsUserTokensPopupVisible] =
    useState(false);

  const handleCreateToken = async () => {
    await createToken(tokenName, tokenSymbol);
    await getTokenInfo(setTokenInfo);

    await getUserTokens(setUserTokens);
  };

  useEffect(() => {
    getTokenInfo(setTokenInfo);
    getUserTokens(setUserTokens);
  }, []);

  const handleMintToken = async (tokenAddress: string) => {
    await mintToken(tokenAddress);
    await handleGetBalance(tokenAddress);
  };

  const handleGetBalance = async (tokenAddress: string) => {
    const balance = await getBalance(tokenAddress);
    if (Number(balance) > 0) {
      const token = tokenInfo.find((t) => t.tokenAddress === tokenAddress);
      if (token) {
        setUserTokens((prevTokens) => [
          ...prevTokens,
          { name: token.name, symbol: token.symbol },
        ]);
      }
    }
  };

  async function getBalance(tokenAddress: string) {
    const account = getAccount(config);
    try {
      const balance = await readContract(config, {
        abi: WETHABI,
        address: tokenAddress,
        functionName: "balanceOf",
        args: [account.address],
      });
      return balance;
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center mt-8 space-x-8">
      {/* All Tokens Section */}
      <div className="flex flex-col bg-transparent border-2 border-gray-500 border-opacity-80 shadow-lg shadow-cyan-400 w-[500px] h-[700px] rounded-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-white">All Tokens</h1>
          <button
            onClick={() => setIsMintPopupVisible(true)}
            className="text-white opacity-60 text-lg"
          >
            ?
          </button>
        </div>
        <div className="flex flex-col space-y-2 overflow-y-auto custom-scrollbar h-full">
          {tokenInfo.map((token) => (
            <div
              key={token.tokenAddress}
              className="flex flex-row justify-between items-center bg-gray-800 text-white p-2 rounded-lg"
            >
              <div>
                <p>{token.name}</p>
                <p className="text-gray-400">({token.symbol})</p>
              </div>
              <button
                className="text-white w-16 h-8 bg-blue-800 hover:bg-blue-950 transition rounded-lg"
                onClick={() => handleMintToken(token.tokenAddress)} // Handle the approve action or any related action
              >
                Mint
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Create Token and Your Tokens Section */}
      <div className="flex flex-col bg-transparent border-2 border-gray-500 border-opacity-80 shadow-lg shadow-cyan-400 w-[500px] h-[700px] rounded-xl p-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Create Token</h1>
          <button
            onClick={() => setIsCreatePopupVisible(true)}
            className="text-white opacity-60 text-lg"
          >
            ?
          </button>
        </div>
        <div className="flex flex-col mt-4">
          <input
            type="text"
            placeholder="Token Name"
            className="bg-transparent text-white p-2 border-b border-gray-600"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Token Symbol"
            className="bg-transparent text-white p-2 mt-4 border-b border-gray-600"
            value={tokenSymbol}
            onChange={(e) => setTokenSymbol(e.target.value)}
          />
          <motion.button
            className="bg-blue-800 hover:bg-blue-950 opacity-80 text-white py-2 px-4 rounded-xl mt-4"
            onClick={handleCreateToken}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.7 }}
          >
            Create Token
          </motion.button>
        </div>

        <div className="flex flex-col mt-8 h-full">
          <div className="flex justify-between items-center mt-8">
            <h1 className="text-2xl font-bold text-white">Your Tokens</h1>
            <button
              onClick={() => setIsUserTokensPopupVisible(true)}
              className="text-white opacity-60 text-lg"
            >
              ?
            </button>
          </div>
          <div className="flex flex-col space-y-2 overflow-y-auto custom-scrollbar h-full">
            {userTokens.map((token, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-800 text-white p-2 rounded-lg"
              >
                <p>{token.name}</p>
                <p className="text-gray-400">({token.symbol})</p>
              </div>
            ))}
          </div>
        </div>
        {/* Popups */}
        {isCreatePopupVisible && (
          <div
            className="fixed inset-0 flex justify-center items-center  bg-black bg-opacity-50 z-50 "
            id="popupOverlay"
            onClick={() => setIsCreatePopupVisible(false)}
          >
            <div className=" bg-blue-800 w-[600px] text-white p-4 rounded-lg z-50 text-xl">
              <p>
                In the &apos;Create Token&apos; section, you can generate your
                own ERC20 token by specifying a name and symbol. Once created,
                the token will appear in the &apos;All Tokens&apos; and &apos;Your Tokens&apos; list.
              </p>
            </div>
          </div>
        )}

        {isMintPopupVisible && (
          <div
            className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
            id="popupOverlay"
            onClick={() => setIsMintPopupVisible(false)}
          >
            <div className="bg-blue-800 text-white p-4 rounded-lg w-[800px] text-center text-xl">
              <p>
                The mint button allows you to mint a token that was minted by
                someone else but you do not own. Do not forget to write a token
                minting function in your token contract without creating a
                token.
              </p>
            </div>
          </div>
        )}

        {isUserTokensPopupVisible && (
          <div
            className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 "
            id="popupOverlay"
            onClick={() => setIsUserTokensPopupVisible(false)}
          >
            <div className=" bg-blue-800 text-white p-4 rounded-lg z-50 text-xl">
              <p>
                The &apos;Your Tokens&apos; section displays the tokens that you
                have created or minted. You can manage these tokens through this
                interface.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateToken;
