// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract BasicNft is ERC721 {
    string public constant TOKEN_URI = "mockedTokenUri:1";
    uint256 private s_tokenCounter;

    event NftMinted(uint256 indexed tokenId, address indexed minter);

    constructor() ERC721("Basic NFT", "BNT") {
        s_tokenCounter = 1;
    }

    function mintNft() public returns (uint256) {
        uint256 newTokenId = s_tokenCounter;
        _safeMint(msg.sender, newTokenId);
        emit NftMinted(newTokenId, msg.sender);
        s_tokenCounter++;
        return newTokenId;
    }
}
