"use client";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import {
  createPair,
  getPair,
  getAllPairsLength,
  getAllPairs,
  Approve,
} from "../utils/Functions";
import { getTokenInfo } from "../utils/createTokenFunctions";

interface TokenInfo {
  tokenAddress: string;
  mintedBy: string;
  name: string;
  symbol: string;
}

const Pools = () => {
  const [pools, setPools] = useState<{ pair: string }[]>([]);
  const [isCreatePoolOpen, setCreatePoolOpen] = useState(false);
  const [isAddLiquidityOpen, setAddLiquidityOpen] = useState(false);
  const [isRemoveLiquidityOpen, setRemoveLiquidityOpen] = useState(false);
  const [token1Address, setToken1Address] = useState("");
  const [token2Address, setToken2Address] = useState("");
  const [token1Symbol, setToken1Symbol] = useState("");
  const [token2Symbol, setToken2Symbol] = useState("");
  const [tokenInfo, setTokenInfo] = useState<TokenInfo[]>([]);

  useEffect(() => {
    loadPools();
  }, []);

  useEffect(() => {
    if (tokenInfo.length > 0) {
      findPairs(); 
    }
  }, [tokenInfo]);

  const loadPools = async () => {
    await getTokenInfo(setTokenInfo);
  };

  const findPairs = async () => {
    const foundPools = []; 
    for (let i = 0; i < tokenInfo.length; i++) {
      for (let j = i + 1; j < tokenInfo.length; j++) {
        const token1 = tokenInfo[i];
        const token2 = tokenInfo[j];
        const pairAddress = await getPair(
          token1.tokenAddress,
          token2.tokenAddress
        );
        if (
          String(pairAddress) !== "0x0000000000000000000000000000000000000000"
        ) {
          foundPools.push({ pair: `${token1.symbol}/${token2.symbol}` });
        } else {
          alert("Pair not found");
        }
      }
    }
    setPools(foundPools);
    console.log("Found Pools: ", foundPools);
  };

  const handleCreatePoolClick = () => {
    setCreatePoolOpen(true);
  };

  const handleCreatePool = async () => {
    try {
      await createPair(token1Address, token2Address);
      await getPair(token1Address, token2Address);

      await getTokenInfo(setTokenInfo);

      await getTokenSymbols();

      await Approve(token1Address);
      await Approve(token2Address);

      setCreatePoolOpen(false);
    } catch (error) {
      console.error("Error creating pool:", error);
    }
  };

  const getTokenSymbols = async () => {
    for (let i = 0; i < tokenInfo.length; i++) {
      if (tokenInfo[i].tokenAddress === token1Address) {
        setToken1Symbol(tokenInfo[i].symbol);
      } else if (tokenInfo[i].tokenAddress === token2Address) {
        setToken2Symbol(tokenInfo[i].symbol);
      }
    }
  };

  const handleAddLiquidityClick = () => {
    setAddLiquidityOpen(true);
  };

  const handleRemoveLiquidityClick = () => {
    setRemoveLiquidityOpen(true);
  };

  const handleClosePopup = () => {
    setCreatePoolOpen(false);
    setAddLiquidityOpen(false);
    setRemoveLiquidityOpen(false);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <div className="flex flex-col items-center w-[1000px]">
        <div className="flex justify-between items-center w-full mb-4">
          <h1 className="text-2xl font-bold text-white">Pools</h1>
          <motion.button
            className="bg-cyan-900 opacity-80 text-white py-2 px-4 rounded-xl"
            onClick={handleCreatePoolClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Create Pool
          </motion.button>
        </div>

        <div className="bg-transparent border-white border-[0.05px] border-opacity-30 p-6 rounded-lg shadow-lg w-full">
          {pools.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 bg-transparent rounded-lg">
              <svg
                fill="rgba(255, 255, 255, 0.8)"
                width="100px"
                height="100px"
                viewBox="-2 -4 24 24"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMinYMin"
                className="jam jam-box-f mb-4"
              >
                <path d="M20 5H0V3a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v2zm0 2v6a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V7h6.126a4.002 4.002 0 0 0 7.748 0H20z" />
              </svg>
              <p className="text-white">
                Your active liquidity positions will appear here.
              </p>
            </div>
          ) : (
            <div className="bg-transparent rounded-lg p-6 max-h-[400px] overflow-y-auto custom-scrollbar">
              <h2 className="text-xl mb-4 text-white">
                Your positions ({pools.length})
              </h2>
              {pools.map((pool, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-4 border-b border-gray-700"
                >
                  <div>
                    <span className="block text-lg text-white">
                      {pool.pair}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <motion.button
                      className="bg-cyan-900 opacity-80 text-white py-1 px-3 rounded-xl ml-4"
                      onClick={handleAddLiquidityClick}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      Add Liquidity
                    </motion.button>
                    <motion.button
                      className="bg-cyan-900 opacity-80 text-white py-1 px-3 rounded-xl ml-4"
                      onClick={handleRemoveLiquidityClick}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      Remove Liquidity
                    </motion.button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Pool Popup */}
        {isCreatePoolOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={handleClosePopup}
          >
            <div
              className="bg-gray-900 p-6 rounded-lg w-96"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-white mb-4">Create Pool</h2>
              <input
                type="text"
                placeholder="Token 1 Address"
                value={token1Address}
                onChange={(e) => setToken1Address(e.target.value)}
                className="w-full p-3 mb-4 rounded bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Token 2 Address"
                value={token2Address}
                onChange={(e) => setToken2Address(e.target.value)}
                className="w-full p-3 mb-4 rounded bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <motion.button
                className="bg-cyan-900 opacity-80 text-white py-2 px-4 rounded-xl w-full"
                onClick={handleCreatePool}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Create Pool
              </motion.button>
            </div>
          </div>
        )}

        {/* Add Liquidity Popup */}
        {isAddLiquidityOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={handleClosePopup}
          >
            <div
              className="bg-gray-900 p-6 rounded-lg w-96"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Your Add Liquidity form or content goes here */}
              <p className="text-white">Add Liquidity Popup Content</p>
            </div>
          </div>
        )}
        {isRemoveLiquidityOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={handleClosePopup}
          >
            <div
              className="bg-gray-900 p-6 rounded-lg w-96"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Your Add Liquidity form or content goes here */}
              <p className="text-white">Remove Liquidity Popup Content</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pools;
