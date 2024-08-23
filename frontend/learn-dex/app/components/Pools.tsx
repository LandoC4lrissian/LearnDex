import React, { useState } from 'react';

const Pools = () => {
  const [pools, setPools] = useState([
    { id: 1, pair: 'TKNA / EDU', fee: '0.30%', min: '0 TKNA per EDU', max: '∞ TKNA per EDU', status: 'In range' },
    { id: 2, pair: 'TKNA / TKNB', fee: '0.30%', min: '0 TKNA per TKNB', max: '∞ TKNA per TKNB', status: 'In range' },
    { id: 3, pair: 'USDC / EDU', fee: '0.30%', min: '0 USDC per EDU', max: '∞ USDC per EDU', status: 'In range' },
  ]);
  const [isCreatePoolOpen, setCreatePoolOpen] = useState(false);
  const [isAddLiquidityOpen, setAddLiquidityOpen] = useState(false);

  const handleCreatePoolClick = () => {
    setCreatePoolOpen(true);
  };

  const handleAddLiquidityClick = () => {
    setAddLiquidityOpen(true);
  };

  const handleClosePopup = () => {
    setCreatePoolOpen(false);
    setAddLiquidityOpen(false);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <div className="flex flex-col items-center w-[1000px]">
        <div className="flex justify-between items-center w-full mb-4">
          <h1 className="text-2xl font-bold text-white">Pools</h1>
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500"
            onClick={handleCreatePoolClick}
          >
            Create Pool
          </button>
        </div>

        <div className="bg-transparent border-white border-[0.05px] border-opacity-30 p-6 rounded-lg shadow-lg w-full">
          {pools.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 bg-gray-800 rounded-lg">
              <p className="text-white">Your active liquidity positions will appear here.</p>
              <button className="bg-blue-600 text-white py-2 px-4 rounded-md mt-4 hover:bg-blue-500">
                Connect a wallet
              </button>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl mb-4 text-white">Your positions ({pools.length})</h2>
              {pools.map((pool) => (
                <div key={pool.id} className="flex justify-between items-center py-4 border-b border-gray-700">
                  <div>
                    <span className="block text-lg text-white">{pool.pair}</span>
                    <span className="block text-gray-400">{pool.fee}</span>
                    <p className="text-gray-400">
                      Min: {pool.min} ↔ Max: {pool.max}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500">{pool.status}</span>
                    <button
                      className="bg-blue-600 text-white py-1 px-3 rounded-md ml-4 hover:bg-blue-500"
                      onClick={handleAddLiquidityClick}
                    >
                      Add Liquidity
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
              className="bg-gray-900 p-6 rounded-lg w-96"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Your Create Pool form or content goes here */}
              <p className="text-white">Create Pool Popup Content</p>
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
      </div>
    </div>
  );
};

export default Pools;
