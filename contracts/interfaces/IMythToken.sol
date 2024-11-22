// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

interface IMythToken {
    function handleMintNFT(address minter, uint256 value) external returns (bool);

    function handleBuy(address buyer, address seller, uint256 value) external returns (bool);

    function withdrawProceeds() external;

    function getProceeds(address seller) external returns (uint256);
}
