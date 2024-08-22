import React from "react";

const Swap = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-40 bg-transparent">
      <div className="bg-gray-800 text-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Swap</h2>
          <button className="text-gray-400 hover:text-gray-200">
            <i className="fas fa-cog"></i> {/* Icon for settings */}
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center bg-gray-700 p-3 rounded-md">
            <div>
              <label className="block text-gray-400 text-sm">You pay</label>
              <input
                type="number"
                className="bg-transparent border-none outline-none w-full text-xl"
                placeholder="0"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span>EDU</span>
              <i className="fas fa-chevron-down text-gray-400"></i> {/* Icon for dropdown */}
            </div>
          </div>

          <div className="flex justify-center">
            <button className="bg-gray-700 p-2 rounded-full">
              <i className="fas fa-arrow-down"></i> {/* Icon for swap direction */}
            </button>
          </div>

          <div className="flex justify-between items-center bg-gray-700 p-3 rounded-md">
            <div>
              <label className="block text-gray-400 text-sm">You receive</label>
              <input
                type="number"
                className="bg-transparent border-none outline-none w-full text-xl"
                placeholder="0"
              />
            </div>
            <button className="bg-blue-500 text-white px-3 py-1 rounded-md">
              Select token
            </button>
          </div>

          <button className="w-full mt-4 py-3 bg-blue-600 text-white rounded-md">
            Connect wallet
          </button>
        </div>
      </div>
    </div>
  );
};

export default Swap;
