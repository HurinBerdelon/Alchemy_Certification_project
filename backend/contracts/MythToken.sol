// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IMythToken} from "./interfaces/IMythToken.sol";

import "hardhat/console.sol";

error MythToken__NoProceeds();
error MythToken__WithdrawFailed();
error MythToken__NotEnoughBalance();
error MythToken__NotEnoughTokenSent();
error MythToken__TransferFailed();
error MythToken__NotApprovedToTransfer();
error MythToken__CannotFundUser();

contract MythToken is IMythToken, ERC20 {
    struct LastFund {
        uint256 sequentialDays;
        uint256 timestamp;
    }

    event UserFunded(address indexed user, uint256 amount, uint256 timestamp);

    mapping(address => uint256) private s_proceeds;

    mapping(address => LastFund) private s_lastFunds;

    constructor(
        string memory _tokenName,
        string memory _tokenSymbol,
        uint256 _initialSupply
    ) ERC20(_tokenName, _tokenSymbol) {
        _mint(address(this), _initialSupply);
    }

    function internalApprove(address spender, uint256 value) internal {
        _approve(address(this), spender, value);
    }

    // When minting token for user, burn some from the contract itself
    function fundMe(uint256 value) external {
        if (
            s_lastFunds[msg.sender].timestamp > 0 &&
            block.timestamp < s_lastFunds[msg.sender].timestamp + (24 * 60 * 60)
        ) {
            revert MythToken__CannotFundUser();
        }

        if (block.timestamp > s_lastFunds[msg.sender].timestamp + (2 * 24 * 60 * 60)) {
            s_lastFunds[msg.sender] = LastFund({sequentialDays: 1, timestamp: block.timestamp});
        } else {
            s_lastFunds[msg.sender] = LastFund({
                sequentialDays: s_lastFunds[msg.sender].sequentialDays++,
                timestamp: block.timestamp
            });
        }

        _burn(address(this), value);
        _mint(msg.sender, value);

        emit UserFunded(msg.sender, value, block.timestamp);
    }

    // To be called by another contract (MythNft)
    function handleMintNFT(address minter, uint256 value) external returns (bool) {
        uint256 balance = balanceOf(minter);

        if (balance < value) {
            revert MythToken__NotEnoughBalance();
        }

        bool success = transferFrom(minter, address(this), value);

        return success;
    }

    // To be called by another contract (MythNftMarketplace)
    function handleBuy(address buyer, address seller, uint256 value) external returns (bool) {
        uint256 balance = balanceOf(buyer);

        if (balance < value) {
            revert MythToken__NotEnoughBalance();
        }

        s_proceeds[seller] += value;

        bool success = transferFrom(buyer, address(this), value);

        return success;
    }

    // To be called by end user
    function withdrawProceeds() external returns (bool) {
        uint256 proceeds = s_proceeds[msg.sender];
        if (proceeds <= 0) {
            revert MythToken__NoProceeds();
        }

        s_proceeds[msg.sender] = 0;

        internalApprove(msg.sender, proceeds);
        bool success = transferFrom(address(this), msg.sender, proceeds);

        return success;
    }

    // To be called by end user
    function getProceeds() external view returns (uint256) {
        return s_proceeds[msg.sender];
    }
}
