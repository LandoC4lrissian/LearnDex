// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20m is ERC20 {
    constructor(string memory name, string memory symbol, address receiver) ERC20(name, symbol) {
        _mint(receiver, 1000000 * 10 ** decimals());
    }
}
