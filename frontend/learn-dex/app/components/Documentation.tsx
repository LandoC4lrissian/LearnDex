import Link from "next/link";
import React from "react";

const Documentation = () => {
  return (
    <div className=" bg-transparent text-white mt-8">
      <div className="container mx-auto px-4 py-8 flex">
        {/* Sidebar - Table of Contents */}
        <aside className="w-1/4 bg-neutral-800 p-6 rounded sticky top-8">
          <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>
          <nav>
            <ul className="space-y-2">
              <li>
                <a
                  href="#introduction"
                  className="text-blue-400 hover:underline"
                >
                  Introduction
                </a>
              </li>
              <li>
                <a href="#uniswapV2" className="text-blue-400 hover:underline">
                  What is Uniswap V2?
                </a>
              </li>
              <li>
                <a
                  href="#setup Backend"
                  className="text-blue-400 hover:underline"
                >
                  Backend Setup
                </a>
              </li>
              <li>
                <a
                  href="#contractDeploy"
                  className="text-blue-400 hover:underline"
                >
                  Deploy Contract
                </a>
              </li>
              <li>
                <a
                  href="#FrontSetup"
                  className="text-blue-400 hover:underline"
                >
                  Front Setup
                </a>
              </li>
              <li>
                <a
                  href="#frontCode"
                  className="text-blue-400 hover:underline"
                >
                  Interacts with Smart Contracts
                </a>
              </li>
              <li>
                <a href="#conclusion" className="text-blue-400 hover:underline">
                  Conclusion
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="w-3/4 ml-8 overflow-y-auto space-y-12 overflow">
          {/* Introduction Section */}

          <section id="introduction">
            <h1 className="text-3xl font-bold mb-4">Introduction</h1>
            <p className="text-lg">
              This documentation will guide you through the process of creating
              your own Uniswap V2 clone using Next.js and Tailwind CSS.
              You&apos;ll learn how to set up your project, write code, and
              deploy your DEX.
            </p>
          </section>

          <section id="uniswapV2">
            <h2 className="text-2xl font-semibold mb-4">What is Uniswap V2?</h2>
            <p className="mt-4">
              Uniswap V2 is one of the most popular automated market maker (AMM)
              protocols in the decentralized finance (DeFi) ecosystem. Launched
              in 2020, Uniswap V2 operates on the Ethereum blockchain and
              provides a decentralized platform for token swaps.
              <br />
              <br />
              <strong>How Uniswap V2 Works:</strong>
              <br />
              Uniswap V2 uses a mechanism known as an automated market maker
              (AMM). Unlike traditional order book models, AMMs determine prices
              through liquidity pools and a constant mathematical formula.
              <br />
              <br />
              Uniswap V2 uses the constant product formula known as x * y = k,
              where:
              <br />- <strong>x:</strong> The amount of one token in the
              liquidity pool.
              <br />- <strong>y:</strong> The amount of the other token in the
              same liquidity pool.
              <br />- <strong>k:</strong> A constant value that remains
              unchanged to maintain the pool&apos;s liquidity ratio.
              <br />
              <br />
              This formula adjusts the token quantities with every swap,
              dynamically setting prices. For example, if the quantity of one
              token increases, the other decreases, and the prices are adjusted
              accordingly.
              <br />
              <br />
              <strong>Pros (Advantages):</strong>
              <br />- <strong>Decentralization:</strong> Uniswap V2 operates
              without a central authority, allowing users to retain control over
              their assets.
              <br />- <strong>Unlimited Liquidity:</strong> There is no limit on
              how much liquidity can be provided. Users can contribute as much
              liquidity to the pools as they wish.
              <br />- <strong>Ease of Use:</strong> Uniswap V2&apos;s interface
              is highly user-friendly and accessible to everyone.
              <br />- <strong>Supports Trading for Any Token:</strong> Any token
              that complies with the ERC-20 standard can be traded on Uniswap
              V2, offering an easy listing option for project owners.
              <br />- <strong>Income for Liquidity Providers:</strong> Liquidity
              providers earn a share of the trading fees collected from each
              swap in the pools they contribute to.
              <br />-{" "}
              <strong>
                Protection Against Front-Running and Sandwich Attacks:
              </strong>{" "}
              Uniswap V2 includes mechanisms to protect against price
              manipulation and other malicious activities.
              <br />
              <br />
              <strong>Cons (Disadvantages):</strong>
              <br />-{" "}
              <strong>
                Constant Product Formula and Liquidity Issues:
              </strong>{" "}
              The x * y = k formula can lead to significant price slippage,
              especially in large trades and low-liquidity pools.
              <br />- <strong>Impermanent Loss:</strong> Liquidity providers may
              experience impermanent loss due to price fluctuations, which
              represents potential losses incurred before they exit the pool.
              <br />- <strong>High Gas Fees:</strong> Operating on the Ethereum
              blockchain means high gas fees, particularly during periods of
              network congestion, making small transactions less economical.
              <br />- <strong>Impact of Arbitrageurs:</strong> While
              arbitrageurs help correct market prices, their actions can
              sometimes be disadvantageous for liquidity providers.
              <br />- <strong>Technological Risks:</strong> As Uniswap V2 relies
              on smart contracts, there is always the potential risk of smart
              contract bugs and security vulnerabilities.
              <br />
              <br />
            </p>
          </section>

          {/* Setup Section */}
          <section id="setup Backend">
            <h2 className="text-2xl font-semibold mb-4">Backend Setup</h2>
            <p className="text-lg mb-4">
              To start, you&apos;ll need to clone the repository and install the
              necessary dependencies:
            </p>
            <div className="bg-neutral-800 p-4 rounded">
              <div>
                First you need download the code of{" "}
                <Link
                  href={"https://github.com/Uniswap/v2-periphery"}
                  className="text-blue-800"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  v2-periphery{" "}
                </Link>
                and{" "}
                <Link
                  href={"https://github.com/Uniswap/v2-core"}
                  className="text-blue-800"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  v2-core
                </Link>{" "}
                from the Uniswap repository. Then open both folders in your code
                editor.
              </div>
            </div>
          </section>

          {/* Code Example Section */}
          <section id="contractDeploy">
            <h2 className="text-2xl font-semibold mb-4">Deploy Contract</h2>
            <p className="text-lg mb-4">
              Add this code in the UniswapV2Factory.sol which is located in the
              v2-core-master folder.
            </p>
            <div className="bg-neutral-800 p-4 rounded">
              <pre className="whitespace-pre-wrap">
                <code className="text-sm">
                  {`bytes32 public constant INIT_CODE_HASH = keccak256(abi.encodePacked(type(UniswapV2Pair).creationCode));`}
                </code>
              </pre>
            </div>

            <p className="text-lg mb-4 mt-4">
              After deploy the UniswapV2Factory.sol contract, you need to put
              the hex value you received from UniswapV2Factory into the
              UniswapV2Library.sol file.
            </p>
            <div className="bg-neutral-800 p-4 rounded mt-4">
              <pre className="whitespace-pre-wrap">
                <code className="text-sm">
                  {`pragma solidity >=0.5.0;

import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol';

import "./SafeMath.sol";

library UniswapV2Library {
    using SafeMath for uint;

    // returns sorted token addresses, used to handle return values from pairs sorted in this order
    function sortTokens(address tokenA, address tokenB) internal pure returns (address token0, address token1) {
        require(tokenA != tokenB, 'UniswapV2Library: IDENTICAL_ADDRESSES');
        (token0, token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), 'UniswapV2Library: ZERO_ADDRESS');
    }

    // calculates the CREATE2 address for a pair without making any external calls
    function pairFor(address factory, address tokenA, address tokenB) internal pure returns (address pair) {
        (address token0, address token1) = sortTokens(tokenA, tokenB);
        pair = address(uint(keccak256(abi.encodePacked(
                hex'ff',
                factory,
                keccak256(abi.encodePacked(token0, token1)),
                hex'6d83cfb8c1a50477caf772261e7b0867452be6bfa2d42ba2be1b79b9c3a958e6' // init code hash
            ))));
    }`}
                </code>
              </pre>
            </div>
            <p className="text-lg mb-4 mt-4">
              After putting hex in the code deploy your UniswapV2Router02.sol
              contract.
            </p>
          </section>

          <section id="FrontSetup">
            <h2 className="text-2xl font-semibold mb-4">Front Setup</h2>
            <p className="text-lg mb-4">
              To start, you&apos;ll need to clone the repository and install the
              necessary dependencies:
            </p>
            <div className="bg-neutral-800 p-4 rounded mt-4">
              <pre className="whitespace-pre-wrap">
                <code className="text-sm">
                  {`yarn create next-app
cd your-app-name`}
                </code>
              </pre>
            </div>
            <p className="mt-4">
              Visit the{" "}
              <Link
                href={"https://www.rainbowkit.com/docs/installation"}
                className="text-blue-800"
                target="_blank"
                rel="noopener noreferrer"
              >
                Rainbowkit Documentation
              </Link>{" "}
              to download the necessary parts for the wallet connection and to
              edit the codes.
            </p>
          </section>

          <section id="frontCode">
            <h2 className="text-2xl font-semibold mb-4">
              Interacts with Smart Contracts
            </h2>
            <p className="mt-4">
              Use{" "}
              <Link
                href={"https://wagmi.sh/react/getting-started"}
                className="text-blue-800"
                target="_blank"
                rel="noopener noreferrer"
              >
                wagmi
              </Link>{" "}
              for interact with the smart contracts.
            </p>
          </section>
          {/* Conclusion Section */}
          <section id="conclusion">
            <h2 className="text-2xl font-semibold mb-4">Conclusion</h2>
            <p className="text-lg">
              By following this documentation, you should now have a working DEX
              built with Next.js and Tailwind CSS. Keep exploring the code and
              customize it to fit your needs!
            </p>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Documentation;
