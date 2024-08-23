// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC20m} from "./ERC20m.sol";

contract Launchpad {
    struct TokenInfo {
        address tokenAddress;
        address mintedBy;
        string name;
        string symbol;
    }

    TokenInfo[] public tokens;
    mapping(address => address[]) public userTokens;

    event TokenDeployed(address indexed tokenAddress, address indexed mintedBy, string name, string symbol);

    function deployToken(string memory name, string memory symbol) public {
        ERC20m token = new ERC20m(name, symbol, msg.sender);
        tokens.push(TokenInfo({
            tokenAddress: address(token),
            mintedBy: msg.sender,
            name: name,
            symbol: symbol
        }));
        userTokens[msg.sender].push(address(token));

        emit TokenDeployed(address(token), msg.sender, name, symbol);
    }

    function getTokenInfo() public view returns (TokenInfo[] memory) {
        return tokens;
    }

    function getUserTokens(address user) public view returns (address[] memory) {
        return userTokens[user];
    }
}
