import React, { useState } from "react";

const Swap = () => {
  const [selectedToken1, setSelectedToken1] = useState("EDU");
  const [selectedToken2, setSelectedToken2] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [activeTokenInput, setActiveTokenInput] = useState(1);

  const handleTokenSelect = (token) => {
    if (activeTokenInput === 1) {
      setSelectedToken1(token);
    } else {
      setSelectedToken2(token);
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
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center ">
      <div className="bg-neutral-900 w-[500px] h-[440px] rounded-3xl flex flex-col items-center relative">
        <h1 className="p-4 text-lg text-white opacity-60 absolute top-0 left-4">Swap</h1>
        <div className="flex flex-col space-y-2 mt-16">
          <div className="flex flex-row w-[470px] h-32 p-2 bg-neutral-800 rounded-3xl">
            <div className="flex flex-col w-[470px] h-32">
              <h1 className="p-2 text-xs text-white opacity-60">You Pay</h1>
              <div className="flex items-center">
                <input
                  type="number"
                  className="bg-transparent w-[200px] h-12 p-2 text-white text-3xl appearance-none focus:outline-none"
                  placeholder="0"
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
                  className="ml-auto bg-cyan-900 opacity-80 rounded-3xl text-white text-xl px-4 py-2"
                  onClick={() => openTokenSelectPopup(1)}
                >
                  {selectedToken1}
                </button>
              </div>
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
                  placeholder="0"
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
                  className="ml-auto bg-cyan-900 opacity-80 rounded-3xl text-white text-xl px-4 py-2"
                  onClick={() => openTokenSelectPopup(2)}
                >
                  {selectedToken2 || "Select Token"}
                </button>
              </div>
            </div>
          </div>
        </div>
        <button className="w-[470px] h-12 bg-cyan-900 opacity-80 rounded-3xl text-white text-lg mt-2">
          Swap
        </button>

        {/* Token Select Popup */}
        {isPopupVisible && (
          <div
            id="popupOverlay"
            className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
            onClick={closePopupOnOutsideClick}
          >
            <div className="bg-neutral-900 w-[500px] h-[550px] rounded-3xl flex flex-col items-center p-4">
              <div className="w-full flex justify-between items-center">
                <h1 className="text-white opacity-60 text-lg">Select a token</h1>
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
              <div className="mt-4 w-full flex flex-col space-y-2">
                {["EDU", "Wrapped EDU", "Token A", "Token B", "USDC"].map(
                  (token, index) => (
                    <button
                      key={index}
                      className="w-full p-4 bg-neutral-800 rounded-3xl text-white flex justify-between items-center"
                      onClick={() => handleTokenSelect(token)}
                    >
                      <span>{token}</span>
                      <span className="opacity-60 text-sm">
                        {token === "EDU"
                          ? "EDU"
                          : token === "Wrapped EDU"
                          ? "WEDU"
                          : token === "Token A"
                          ? "TKNA"
                          : token === "Token B"
                          ? "TKNB"
                          : "USDC"}
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Swap;
