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
import { addLiquidity, removeLiquidity } from "../utils/liquidityFunctions";
import { useRef } from "react";
import { ethers } from "ethers";
import { keccak256, toBytes } from "viem";
import { decodeEventLog } from "viem";
import { config } from "../utils/config";
import { FactoryABI } from "../utils/factoryABI.json";

const eventSignature = keccak256(
  toBytes("PairCreated(address,address,address,uint256)")
);
console.log("Event Signature: ", eventSignature);

interface TokenInfo {
  tokenAddress: string;
  mintedBy: string;
  name: string;
  symbol: string;
}

interface Pair {
  args: { token0: string; token1: string; pair: string; arg3: number };
  eventName: string;
}

const Pools = () => {
  const [pools, setPools] = useState<
    { pair: string; token1Address: string; token2Address: string }[]
  >([]);
  const [isCreatePoolOpen, setCreatePoolOpen] = useState(false);
  const [isAddLiquidityOpen, setAddLiquidityOpen] = useState(false);
  const [isRemoveLiquidityOpen, setRemoveLiquidityOpen] = useState(false);
  const [token1Address, setToken1Address] = useState("");
  const [token2Address, setToken2Address] = useState("");
  const [token1Symbol, setToken1Symbol] = useState("");
  const [token2Symbol, setToken2Symbol] = useState("");
  const [tokenInfo, setTokenInfo] = useState<TokenInfo[]>([]);
  const [amountToken1, setAmountToken1] = useState("");
  const [amountToken2, setAmountToken2] = useState("");
  const [removeLiquidityAmount, setRemoveLiquidityAmount] = useState("");
  const [selectedPool, setSelectedPool] = useState<{
    token1Address: string;
    token2Address: string;
  } | null>(null);
  const token1AddressRef = useRef<string | null>(null);
  const token2AddressRef = useRef<string | null>(null);
  const [pair, setPair] = useState("");
  const [events, setEvents] = useState<Pair[]>([]);

  const [isCreatePoolHelpVisible, setIsCreatePoolHelpVisible] = useState(false);
  const [isAddLiquidityHelpVisible, setIsAddLiquidityHelpVisible] =
    useState(false);

  useEffect(() => {
    loadPools();
    getEvents();
  }, []);

  useEffect(() => {
    if (tokenInfo.length > 0) {
      findPairs();
    }
  }, [tokenInfo]);

  const loadPools = async () => {
    await getTokenInfo(setTokenInfo);
  };

  async function getEvents() {
    try {
      const response = await fetch(
        "https://opencampus-codex.blockscout.com/api/v2/addresses/0x550F5925cADF71086bdCE274ceA5779F67f57C42/logs"
      );
      const data = await response.json();
      const decodedEvents: Pair[] = [];
      for (let item of data.items) {
        if (item.topics[0].toLowerCase() === eventSignature.toLowerCase()) {
          const decodedEvent = decodeEventLog({
            abi: FactoryABI,
            data: item.data,
            topics: item.topics.slice(0, 4),
          });
          console.log(decodedEvent);

          decodedEvents.push({
            args: {
              token0: decodedEvent.args[0],
              token1: decodedEvent.args[1],
              pair: decodedEvent.args[2],
              arg3: decodedEvent.args[3],
            },
            eventName: decodedEvent.eventName,
          });
        }
      }
      setEvents(decodedEvents);
    } catch (error) {
      console.error(error);
    }
  }

  const findPairs = async () => {
    const foundPools = [];
    for (let i = 0; i < tokenInfo.length; i++) {
      for (let j = i + 1; j < tokenInfo.length; j++) {
        const token1 = tokenInfo[i];
        const token2 = tokenInfo[j];
        const pairAddress = await getPair(
          token1.tokenAddress,
          token2.tokenAddress,
          setPair
        );
        if (
          String(pairAddress) !== "0x0000000000000000000000000000000000000000"
        ) {
          foundPools.push({
            pair: `${token1.symbol}/${token2.symbol}`,
            token1Address: token1.tokenAddress,
            token2Address: token2.tokenAddress,
          });
        }
      }
    }
    setPools(foundPools);
  };

  const handleCreatePoolClick = () => {
    setCreatePoolOpen(true);
  };

  const handleCreatePool = async () => {
    try {
      await createPair(token1Address, token2Address);
      await getPair(token1Address, token2Address, setPair);

      await getTokenInfo(setTokenInfo);
      await Approve(token1Address);
      await Approve(token2Address);

      await getTokenSymbols();
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

  const handleToken1Select = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedToken = tokenInfo.find(
      (token) => token.tokenAddress === e.target.value
    );
    if (selectedToken) {
      setToken1Address(selectedToken.tokenAddress);
      setToken1Symbol(selectedToken.symbol);
    }
  };

  const handleToken2Select = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedToken = tokenInfo.find(
      (token) => token.tokenAddress === e.target.value
    );
    if (selectedToken) {
      setToken2Address(selectedToken.tokenAddress);
      setToken2Symbol(selectedToken.symbol);
    }
  };

  const handleAddLiquidityClick = (pool: {
    token1Address: string;
    token2Address: string;
  }) => {
    token1AddressRef.current = pool.token1Address;
    token2AddressRef.current = pool.token2Address;
    setAddLiquidityOpen(true);
  };

  const handleAddLiquidity = async () => {
    try {
      if (!token1AddressRef.current || !token2AddressRef.current) {
        console.error("Token addresses are not set.");
        return;
      }

      if (
        !ethers.utils.isAddress(token1AddressRef.current) ||
        !ethers.utils.isAddress(token2AddressRef.current)
      ) {
        console.error("One or both token addresses are invalid.");
        return;
      }

      await addLiquidity(
        token1AddressRef.current,
        token2AddressRef.current,
        amountToken1,
        amountToken2,
        18,
        18
      );
      setAddLiquidityOpen(false);
    } catch (error) {
      console.error("Error adding liquidity:", error);
    }
  };

  const handleRemoveLiquidityClick = async (pool: {
    token1Address: string;
    token2Address: string;
    index: number;
  }) => {
    console.log("Checking pool:", pool);
    console.log("Events:", events);

    const foundEvent = events.find(
      (event) =>
        (event.args.token0.toLowerCase() === pool.token1Address.toLowerCase() &&
          event.args.token1.toLowerCase() ===
            pool.token2Address.toLowerCase()) ||
        (event.args.token0.toLowerCase() === pool.token2Address.toLowerCase() &&
          event.args.token1.toLowerCase() === pool.token1Address.toLowerCase())
    );
    console.log("Found Event:", foundEvent);
    if (foundEvent) {
      const poolAddress = foundEvent.args.pair;
      await Approve(poolAddress);
      setToken1Address(pool.token1Address);
      setToken2Address(pool.token2Address);
      setRemoveLiquidityOpen(true);
    } else {
      console.error("Pool not found.");
    }
  };

  const handleRemoveLiquidity = async () => {
    try {
      const foundEvent = events.find(
        (event) =>
          (event.args.token0.toLowerCase() === token1Address.toLowerCase() &&
            event.args.token1.toLowerCase() === token2Address.toLowerCase()) ||
          (event.args.token0.toLowerCase() === token2Address.toLowerCase() &&
            event.args.token1.toLowerCase() === token1Address.toLowerCase())
      );
      console.log("Found Event:", foundEvent);
      if (foundEvent) {
        await removeLiquidity(
          token1Address,
          token2Address,
          Number(removeLiquidityAmount),
          String(foundEvent.args.pair)
        );
        setRemoveLiquidityOpen(false);
      } else {
        console.error("Pool address not found.");
      }
    } catch (error) {
      console.error("Error removing liquidity:", error);
    }
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
          <div>
            <motion.button
              className="bg-blue-800 hover:bg-blue-950  opacity-80 text-white py-2 px-4 rounded-xl"
              onClick={handleCreatePoolClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Create Pool
            </motion.button>
            <button
              onClick={() => setIsCreatePoolHelpVisible(true)}
              className="ml-2 text-white opacity-60 text-lg"
            >
              ?
            </button>
          </div>
        </div>

        <div className="bg-transparent border-white shadow-lg shadow-cyan-400 border-[0.05px] border-opacity-30 p-6 rounded-lg shadow-lg w-full">
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
                Positions ({pools.length})
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
                      className="bg-blue-800 hover:bg-blue-950 opacity-80 text-white py-1 px-3 rounded-xl ml-4"
                      onClick={() => handleAddLiquidityClick(pool)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      Add Liquidity
                    </motion.button>
                    <motion.button
                      className="bg-blue-800 hover:bg-blue-950 opacity-80 text-white py-1 px-3 rounded-xl ml-4"
                      onClick={() => handleRemoveLiquidityClick(pool, index)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      Remove Liquidity
                    </motion.button>
                    <button
                      onClick={() => setIsAddLiquidityHelpVisible(true)}
                      className="ml-2 text-white opacity-60 text-lg"
                    >
                      ?
                    </button>
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
              className="bg-neutral-800 p-6 rounded-lg w-96"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-white mb-4">Create Pool</h2>
              <select
                className="w-full p-3 mb-4 rounded bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleToken1Select}
              >
                <option value="">Select Token 1</option>
                {tokenInfo.map((token) => (
                  <option key={token.tokenAddress} value={token.tokenAddress}>
                    {token.name} ({token.symbol})
                  </option>
                ))}
              </select>
              <select
                className="w-full p-3 mb-4 rounded bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleToken2Select}
              >
                <option value="">Select Token 2</option>
                {tokenInfo.map((token) => (
                  <option key={token.tokenAddress} value={token.tokenAddress}>
                    {token.name} ({token.symbol})
                  </option>
                ))}
              </select>
              <motion.button
                className="bg-blue-800 hover:bg-blue-950 opacity-80 text-white py-2 px-4 rounded-xl w-full"
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
              className="bg-neutral-800 p-6 rounded-lg w-96"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-white mb-4">
                Add Liquidity
              </h2>
              <input
                type="text"
                placeholder="Token 1 Amount"
                value={amountToken1}
                onChange={(e) => setAmountToken1(e.target.value)}
                className="w-full p-3 mb-4 rounded bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Token 2 Amount"
                value={amountToken2}
                onChange={(e) => setAmountToken2(e.target.value)}
                className="w-full p-3 mb-4 rounded bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <motion.button
                className="bg-blue-800 hover:bg-blue-950 opacity-80 text-white py-2 px-4 rounded-xl w-full"
                onClick={handleAddLiquidity}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Add Liquidity
              </motion.button>
            </div>
          </div>
        )}
        {isRemoveLiquidityOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={handleClosePopup}
          >
            <div
              className="bg-neutral-800 p-6 rounded-lg w-96"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-white mb-4">
                Remove Liquidity
              </h2>
              <input
                type="text"
                placeholder="Amount to Remove"
                value={removeLiquidityAmount}
                onChange={(e) => setRemoveLiquidityAmount(e.target.value)}
                className="w-full p-3 mb-4 rounded bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <motion.button
                className="bg-blue-800 hover:bg-blue-950 opacity-80 text-white py-2 px-4 rounded-xl w-full"
                onClick={handleRemoveLiquidity}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Remove Liquidity
              </motion.button>
            </div>
          </div>
        )}
        {/* Help Popups */}
        {isCreatePoolHelpVisible && (
          <div
            className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 "
            id="popupOverlay"
            onClick={() => setIsCreatePoolHelpVisible(false)}
          >
            <div className=" bg-blue-800 text-white p-4 rounded-lg z-50 text-xl">
              <p>
                To create a pool, select the two tokens you want to pair, then
                click &apos;Create Pool. This will create a new liquidity pool
                for the selected tokens.
              </p>
            </div>{" "}
          </div>
        )}

        {isAddLiquidityHelpVisible && (
          <div
            className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 "
            id="popupOverlay"
            onClick={() => setIsAddLiquidityHelpVisible(false)}
          >
            <div className=" bg-blue-800 space-y-4 text-white p-4 rounded-lg z-50 text-xl">
              <p>
                To add liquidity, select a pool and enter the amounts of each
                token you wish to contribute. Then click &apos;Add
                Liquidity&apos;.
              </p>
              <p>------------------------------------------------------------------------------------------------------------------------------</p>
              <p>
                To remove liquidity, select a pool and enter the amount of token
                amount you wish to remove. Then click &apos;Remove
                Liquidity&apos;.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pools;
