"use client";
import React, { useState, useEffect } from "react";
import {
  getTokenDecimal,
  swapExactETHForTokens,
  swapExactTokensForTokens,
} from "../utils/swapFuntions";
import { getTokenInfo } from "../utils/createTokenFunctions";
import { getBalance } from "../utils/liquidityFunctions";
import { getPair } from "../utils/Functions";
import { getAccount } from "@wagmi/core";
import { config } from "../utils/config";
("");
interface TokenInfo {
  tokenAddress: string;
  mintedBy: string;
  name: string;
  symbol: string;
}

const Swap = () => {
  const [selectedToken1, setSelectedToken1] = useState("");
  const [selectedToken2, setSelectedToken2] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [activeTokenInput, setActiveTokenInput] = useState(1);
  const [decimal, setDecimal] = useState(18);
  const [amountIn, setAmountIn] = useState("");
  const [token1Address, setToken1Address] = useState("");
  const [token2Address, setToken2Address] = useState("");
  const [tokens, setTokenInfo] = useState<TokenInfo[]>([]);
  const [pair, setPair] = useState("");
  const [token1AmountInPool, setToken1AmountInPool] = useState(0);
  const [token2AmountInPool, setToken2AmountInPool] = useState(0);
  const [calculatedAmountOut, setCalculatedAmountOut] = useState(0);
  const [balance, setBalance] = useState(0);
  const account = getAccount(config);
  const [isHelpPopupVisible, setIsHelpPopupVisible] = useState(false);

  useEffect(() => {
    getTokens();
  }, []);

  useEffect(() => {
    console.log("token1AmountInPool: ", token1AmountInPool);
    console.log("token2AmountInPool: ", token2AmountInPool);
    if (token1AmountInPool > 0 && token2AmountInPool > 0 && amountIn) {
      const calculatedAmountOut =
        (Number(amountIn) * token2AmountInPool) / token1AmountInPool;
      setCalculatedAmountOut(calculatedAmountOut);
    }
  }, [amountIn, token1AmountInPool, token2AmountInPool]);

  useEffect(() => {
    const fetchPairAndBalances = async () => {
      if (token1Address && token2Address) {
        console.log("Token1 Address:", token1Address);
        console.log("Token2 Address:", token2Address);

        const pairAddress = await getPair(
          token1Address,
          token2Address,
          setPair
        );
        console.log("Pair Address Directly from getPair:", pairAddress);
        if (
          pairAddress !== undefined &&
          pairAddress !== "0x0000000000000000000000000000000000000000"
        ) {
          console.log("Fetching balances for pair:", pairAddress);
          await getBalance(token1Address, setToken1AmountInPool, pairAddress);
          await getBalance(token2Address, setToken2AmountInPool, pairAddress);
        } else {
          console.log("Pair not found or invalid.");
        }
      }
    };

    fetchPairAndBalances();
  }, [token1Address, token2Address]);

  useEffect(() => {
    console.log("Updated Pair State:", pair);
  }, [pair]);

  useEffect(() => {
    if (token1Address && token2Address) {
      getBalance(token1Address, setBalance, String(account.address));
    }
  }, [token1Address, token2Address, account.address]);

  const getTokens = async () => {
    await getTokenInfo(setTokenInfo);
  };

  const handleTokenSelect = (token) => {
    const selectedToken = tokens.find((t) => t.symbol === token);
    if (activeTokenInput === 1) {
      setSelectedToken1(token);
      setToken1Address(selectedToken?.tokenAddress || "");
      // Update balance when token is selected
      if (selectedToken?.tokenAddress) {
        getBalance(
          selectedToken.tokenAddress,
          setBalance,
          String(account.address)
        );
      }
    } else {
      setSelectedToken2(token);
      setToken2Address(selectedToken?.tokenAddress || "");
      // Update balance when token is selected
      if (selectedToken?.tokenAddress) {
        getBalance(
          selectedToken.tokenAddress,
          setBalance,
          String(account.address)
        );
      }
    }
    setIsPopupVisible(false);
  };

  const openTokenSelectPopup = (inputIndex) => {
    setActiveTokenInput(inputIndex);
    setIsPopupVisible(true);
  };

  const closePopupOnOutsideClick = (e) => {
    if (e.target.id === "popupOverlay") {
      setIsPopupVisible(false);
    }
  };

  const swapTokens = () => {
    setSelectedToken1(selectedToken2);
    setSelectedToken2(selectedToken1);
    setToken1Address(token2Address);
    setToken2Address(token1Address);
  };

  const handleSwap = () => {
    if (selectedToken1 === "ETH") {
      swapExactETHForTokens(amountIn, token1Address, token2Address);
    } else {
      swapExactTokensForTokens(token1Address, token2Address, amountIn);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center ">
      <div className="bg-neutral-900 w-[500px] h-[440px] rounded-3xl flex flex-col items-center relative shadow-lg shadow-cyan-400">
        <div className="absolute top-0 right-4 mt-4">
          <button
            onClick={() => setIsHelpPopupVisible(true)}
            className="text-white opacity-60 text-lg"
          >
            ?
          </button>
        </div>
        <h1 className="p-4 text-lg text-white opacity-60 absolute top-0 left-4">
          Swap
        </h1>
        <div className="flex flex-col space-y-2 mt-16">
          <div className="flex flex-row w-[470px] h-32 p-2 bg-neutral-800 rounded-3xl">
            <div className="flex flex-col w-[470px] h-32">
              <h1 className="p-2 text-xs text-white opacity-60">You Pay</h1>
              <div className="flex items-center">
                <input
                  type="number"
                  className="bg-transparent w-[200px] h-12 p-2 text-white text-3xl appearance-none focus:outline-none"
                  placeholder="0"
                  value={amountIn}
                  onChange={(e) => setAmountIn(e.target.value)}
                  style={{
                    MozAppearance: "textfield",
                    WebkitAppearance: "none",
                  }}
                />
                <style jsx>{`
                  input[type="number"]::-webkit-inner-spin-button,
                  input[type="number"]::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                  }
                  input[type="number"] {
                    -moz-appearance: textfield;
                  }
                `}</style>
                <button
                  className="ml-auto bg-blue-800 hover:bg-blue-950 transition opacity-80 rounded-3xl text-white text-xl px-4 py-2"
                  onClick={() => openTokenSelectPopup(1)}
                >
                  {selectedToken1 || "Select Token"}
                </button>
              </div>
              {/* Display balance for selected token */}
              {selectedToken1 && (
                <div className="text-white opacity-60 text-xs p-2">
                  Balance: {balance}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center items-center">
            <button
              className="text-white opacity-60 text-2xl transform rotate-0"
              onClick={swapTokens}
            >
              &darr;
            </button>
          </div>

          <div className="flex flex-row w-[470px] h-32 p-2 bg-neutral-800 rounded-3xl">
            <div className="flex flex-col w-[470px] h-32">
              <h1 className="p-2 text-xs text-white opacity-60">You Receive</h1>
              <div className="flex items-center">
                <input
                  type="number"
                  className="bg-transparent w-[200px] h-12 p-2 text-white text-3xl appearance-none focus:outline-none"
                  placeholder={calculatedAmountOut.toString()} // Convert calculatedAmountOut to a string
                  readOnly
                  style={{
                    MozAppearance: "textfield",
                    WebkitAppearance: "none",
                  }}
                />
                <style jsx>{`
                  input[type="number"]::-webkit-inner-spin-button,
                  input[type="number"]::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                  }
                  input[type="number"] {
                    -moz-appearance: textfield;
                  }
                `}</style>
                <button
                  className="ml-auto bg-blue-800 hover:bg-blue-950 transition0 opacity-80 rounded-3xl text-white text-xl px-4 py-2"
                  onClick={() => openTokenSelectPopup(2)}
                >
                  {selectedToken2 || "Select Token"}
                </button>
              </div>
            </div>
          </div>
        </div>
        <button
          className="w-[470px] h-12 bg-blue-800 hover:bg-blue-950 transition opacity-80 rounded-3xl text-white text-lg mt-2"
          onClick={handleSwap}
        >
          Swap
        </button>

        {/* Token Select Popup */}
        {isPopupVisible && (
          <div
            id="popupOverlay"
            className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 "
            onClick={closePopupOnOutsideClick}
          >
            <div className="bg-neutral-900 w-[500px] h-[550px] rounded-3xl flex flex-col items-center p-4 ">
              <div className="w-full flex justify-between items-center ">
                <h1 className="text-white opacity-60 text-lg">
                  Select a token
                </h1>
                <button
                  className="text-white opacity-60 text-xl"
                  onClick={() => setIsPopupVisible(false)}
                >
                  &times;
                </button>
              </div>
              <input
                type="text"
                className="w-full mt-4 p-2 rounded bg-neutral-800 text-white"
                placeholder="Search name or paste address"
              />
              <div className="mt-4 w-full flex flex-col space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
                {tokens.map((token, index) => (
                  <button
                    key={index}
                    className="w-full p-4 bg-neutral-800 hover:bg-blue-800 transition rounded-3xl text-white flex justify-between items-center"
                    onClick={() => handleTokenSelect(token.symbol)}
                  >
                    <span>{token.name}</span>
                    <span className="opacity-60 text-sm">{token.symbol}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* Help Popup */}
        {isHelpPopupVisible && (
          <div
            className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 "
            id="popupOverlay"
            onClick={() => setIsHelpPopupVisible(false)}
          >
            <div className=" bg-blue-800 text-white p-4 rounded-lg z-50">
              <p className="text-xl">To perform a swap:</p>
              <ul className="list-disc ml-4 text-xl">
                <li>
                  Select the token you want to swap by clicking &quot;Select Token&quot;
                  under &quot;You Pay&quot;.
                </li>
                <li>
                  Don&apos;t that the 2 tokens you want to swap must be in the same pair.
                </li>
                <li>Enter the amount you wish to swap.</li>
                <li>
                  Click the down arrow to switch between the tokens if
                  necessary.
                </li>
                <li>Click &quot;Swap&quot; to execute the transaction.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Swap;
