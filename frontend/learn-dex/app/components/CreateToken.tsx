"use client";
import React, { useState, useEffect } from "react";
import {
  createToken,
  getTokenInfo,
  getUserTokens,
} from "../utils/createTokenFunctions";
import { Approve } from "../utils/Functions";
import { motion } from "framer-motion";

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

  const handleCreateToken = async () => {
    await createToken(tokenName, tokenSymbol);
    await getTokenInfo(setTokenInfo);

    await getUserTokens(setUserTokens);
  };

  useEffect(() => {
    getTokenInfo(setTokenInfo);
    getUserTokens(setUserTokens);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-transparent">
      <div className="bg-neutral-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6">
          Create a New Token
        </h2>
        <div className="mb-4">
          <label className="block text-white mb-2" htmlFor="tokenName">
            Token Name
          </label>
          <input
            type="text"
            id="tokenName"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            className="w-full p-3 rounded bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter token name"
          />
        </div>
        <div className="mb-6">
          <label className="block text-white mb-2" htmlFor="tokenSymbol">
            Token Symbol
          </label>
          <input
            type="text"
            id="tokenSymbol"
            value={tokenSymbol}
            onChange={(e) => setTokenSymbol(e.target.value)}
            className="w-full p-3 rounded bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter token symbol"
          />
        </div>
        <motion.button
          onClick={handleCreateToken}
          className="w-full bg-cyan-900 opacity-80 text-white font-bold py-3 rounded-xl"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Create Token
        </motion.button>
      </div>

      <div className="bg-neutral-800 p-8 rounded-lg shadow-lg w-full max-w-md mt-8 max-h-[300px] overflow-y-auto custom-scrollbar">
        <h3 className="text-xl font-bold text-white mb-4">Your Tokens</h3>
        {userTokens.length > 0 ? (
          <ul>
            {userTokens.map((token, index) => (
              <li key={index} className="text-white mb-2 ">
                <span className="font-bold">
                  {index + 1}) Token Name: {token.name}
                </span>{" "}
                ({token.symbol})
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-white">You have not deployed any tokens yet.</p>
        )}
      </div>
    </div>
  );
};

export default CreateToken;
