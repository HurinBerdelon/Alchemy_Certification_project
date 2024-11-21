// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IMythToken} from "./interfaces/IMythToken.sol";

error MythToken__NoProceeds();
error MythToken__WithdrawFailed();
error MythToken__NotEnoughToken();
error MythToken__TransferFailed();
error MythToken__NotApprovedToTransfer();

contract MythToken is IMythToken, ERC20 {
    mapping(address => uint256) private s_proceeds;

    constructor() ERC20("MythCoin", "MTC") {}

    // To be called by another contract (MythNftMarketplace)
    function handleBuy(
        address buyer,
        address seller,
        uint256 value
    ) external returns (bool) {
        uint256 balance = balanceOf(buyer);

        if (balance < value) {
            revert MythToken__NotEnoughToken();
        }

        s_proceeds[seller] += value;

        // approve msg.sender (it means the NftMarketplace Contract to transferFrom)
        bool approved = approve(msg.sender, value);
        if (!approved) {
            revert MythToken__NotApprovedToTransfer();
        }

        bool success = transferFrom(buyer, address(this), value);
        if (!success) {
            revert MythToken__TransferFailed();
        }

        return true;
    }

    // To be called by end user
    function withdrawProceeds() external {
        uint256 proceeds = s_proceeds[msg.sender];
        if (proceeds <= 0) {
            revert MythToken__NoProceeds();
        }

        s_proceeds[msg.sender] = 0;

        bool success = transfer(msg.sender, proceeds);

        if (!success) {
            revert MythToken__WithdrawFailed();
        }
    }

    // To be called by end user
    function getProceeds(address seller) external view returns (uint256) {
        return s_proceeds[seller];
    }
}
