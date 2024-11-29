// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

interface IMythToken {
    function mintForUser(address to, uint256 value) external;

    function handleMintNFT(address minter, uint256 value) external returns (bool);

    function handleBuy(address buyer, address seller, uint256 value) external returns (bool);

    function withdrawProceeds() external returns (bool);

    function getProceeds() external returns (uint256);
}
