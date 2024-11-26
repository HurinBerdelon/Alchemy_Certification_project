// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract BasicNft is ERC721 {
    string public constant TOKEN_URI = "mockedTokenUri:1";
    uint256 private s_tokenCounter;

    event NftMinted(uint256 indexed tokenId, address indexed minter);

    constructor() ERC721("Basic NFT", "BNT") {
        s_tokenCounter = 0;
    }

    function mintNft() public {
        _safeMint(msg.sender, s_tokenCounter);
        emit NftMinted(s_tokenCounter, msg.sender);
        s_tokenCounter++;
    }

    function tokenUri() public pure returns (string memory) {
        return TOKEN_URI;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}
