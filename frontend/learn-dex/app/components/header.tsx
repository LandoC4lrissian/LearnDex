"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useState } from "react";
import { useAppContext } from "./AppContext";

const Header = () => {
  const { activeSection, handleSectionChange } = useAppContext();

  const handleButtonClick = (section: string) => {
    handleSectionChange(section);
  };

  return (
    <div className="fixed top-0 w-full bg-transparent z-50 flex justify-between py-2">
      <div>
        <button
          onClick={() => handleButtonClick("swap")}
          className={`${
            activeSection === "swap" ? "text-white" : "text-gray-500 opacity-80"
          } bg-transparent border-none px-4 py-2 rounded-md transition-all duration-300 text-lg`}
        >
          Swap
        </button>
        <button
          onClick={() => handleButtonClick("pools")}
          className={`${
            activeSection === "pools"
              ? "text-white"
              : "text-gray-500 opacity-80"
          } bg-transparent border-none px-4 py-2 rounded-md transition-all duration-300 text-lg`}
        >
          Pools
        </button>
        <button
          onClick={() => handleButtonClick("create-token")}
          className={`${
            activeSection === "create-token"
              ? "text-white"
              : "text-gray-500 opacity-80"
          } bg-transparent border-none px-4 py-2 rounded-md transition-all duration-300 text-lg`}
        >
          Create Token
        </button>
        <button
          onClick={() => handleButtonClick("documentation")}
          className={`${
            activeSection === "documentation"
              ? "text-white"
              : "text-gray-500 opacity-80"
          } bg-transparent border-none px-4 py-2 rounded-md transition-all duration-300 text-lg`}
        >
          Documentation
        </button>
      </div>
      <div className="pr-5 pt-2">
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            mounted,
          }) => (
            <div
              {...(!mounted && {
                "aria-hidden": true,
                style: {
                  opacity: 0,
                  pointerEvents: "none",
                  userSelect: "none",
                },
              })}
            >
              {!mounted || !account || !chain ? (
                <button
                  className="px-4 py-2 bg-transparent text-gray-500 border border-gray-500 rounded-xl opacity-80 hover:text-blue-500 hover:opacity-80 hover:border-blue-500 hover:border-opacity-80 transition-colors duration-300"
                  onClick={openConnectModal}
                  type="button"
                >
                  Connect Wallet
                </button>
              ) : chain.unsupported ? (
                <button
                  className="px-4 py-2 bg-transparent text-red-500 border border-gray-500 rounded-xl opacity-80 hover:text-gray-500 hover:opacity-80 transition-colors duration-300"
                  onClick={openChainModal}
                  type="button"
                >
                  Wrong network
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    className="px-4 py-2 bg-transparent text-gray-500 border border-gray-500 rounded-xl opacity-80 hover:text-blue-500 hover:opacity-80 hover:border-blue-500 hover:border-opacity-80 transition-colors duration-300"
                    onClick={openChainModal}
                    type="button"
                  >
                    {chain.name}
                  </button>

                  <button
                    className="px-4 py-2 bg-transparent text-gray-500 border border-gray-500 rounded-xl opacity-80 hover:text-blue-500 hover:opacity-80 hover:border-blue-500 hover:border-opacity-80 transition-colors duration-300"
                    onClick={openAccountModal}
                    type="button"
                  >
                    {account.displayName}
                    {account.displayBalance && ` (${account.displayBalance})`}
                  </button>
                </div>
              )}
            </div>
          )}
        </ConnectButton.Custom>
      </div>
    </div>
  );
};

export default Header;
