// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
// import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import {IMythToken} from "./interfaces/IMythToken.sol";

error MythNft__RangeOutOfBounds();
error MythNft__NotEnoughTokensPaid();
error MythNft__TransferFailed();
error MythNft__NotEnoughBalance();

// contract MythNft is ERC721, VRFConsumerBaseV2Plus {
contract MythNft is ERC721 {
    // Structures declarations
    struct TokenStructure {
        Rarity rarity;
        string tokenUri;
    }

    // VRF Helpers
    // uint256 private immutable i_subscriptionId;
    // bytes32 private immutable i_gaslane;
    // uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;
    mapping(uint256 => address) public s_requestIdToSender;

    // NFT variable
    uint256 public s_tokenCounter;
    uint256 internal constant MAX_CHANCE_VALUE = 100;
    string[] internal s_tokenUris;
    uint256 internal immutable i_mintFee;

    mapping(uint256 tokenId => TokenStructure) s_mythNftToken;
    address internal immutable i_mythTokenAddress;

    // Events
    event NftRequested(uint256 indexed requestId, address requester);
    event NftMinted(uint256 indexed tokenId, Rarity indexed rarity, address indexed minter);

    // Type declarations
    enum Rarity {
        COMMON,
        RARE,
        MYTHIC
    }

    constructor(
        // address vrfClientAddress,
        // uint256 subscriptionId,
        // bytes32 gaslane,
        // uint32 callbackGasLimit,
        string[] memory tokenUris,
        uint256 mintFee,
        address mythTokenAddress
    )
        // ) ERC721("Mythology Nft", "MTNFT") VRFConsumerBaseV2Plus(vrfClientAddress) {
        ERC721("Mythology Nft", "MTNFT")
    {
        // i_subscriptionId = subscriptionId;
        // i_gaslane = gaslane;
        // i_callbackGasLimit = callbackGasLimit;
        s_tokenUris = tokenUris;
        i_mintFee = mintFee;
        i_mythTokenAddress = mythTokenAddress;
        s_tokenCounter = 1;
    }

    function requestNft(uint256 price, uint256 nftIndex, uint256 nftRarity) public {
        if (price < i_mintFee) {
            revert MythNft__NotEnoughTokensPaid();
        }

        IMythToken(i_mythTokenAddress).handleMintNFT(msg.sender, price);

        address nftOwner = msg.sender;
        uint256 newTokenId = s_tokenCounter;

        uint256 moddedRng = nftIndex % s_tokenUris.length;
        uint256 rarityRng = nftRarity % MAX_CHANCE_VALUE;

        Rarity rarity = getRarityFromRarityRng(rarityRng);
        s_tokenCounter++;

        _safeMint(nftOwner, newTokenId);

        s_mythNftToken[newTokenId] = TokenStructure({
            rarity: rarity,
            tokenUri: s_tokenUris[moddedRng]
        });

        emit NftMinted(newTokenId, rarity, nftOwner);
    }

    // function requestNft(uint256 price) public returns (uint256 requestId) {
    //     if (price < i_mintFee) {
    //         revert MythNft__NotEnoughTokensPaid();
    //     }

    //     IMythToken(i_mythTokenAddress).handleMintNFT(msg.sender, price);

    //     requestId = s_vrfCoordinator.requestRandomWords(
    //         VRFV2PlusClient.RandomWordsRequest({
    //             keyHash: i_gaslane,
    //             subId: i_subscriptionId,
    //             requestConfirmations: REQUEST_CONFIRMATIONS,
    //             callbackGasLimit: i_callbackGasLimit,
    //             numWords: NUM_WORDS,
    //             // Allow request to pay with ETH instead of LINK
    //             extraArgs: VRFV2PlusClient._argsToBytes(
    //                 VRFV2PlusClient.ExtraArgsV1({nativePayment: false})
    //             )
    //         })
    //     );

    //     s_requestIdToSender[requestId] = msg.sender;

    //     emit NftRequested(requestId, msg.sender);

    //     return requestId;
    // }

    // function fulfillRandomWords(
    //     uint256 requestId,
    //     uint256[] calldata randomWords
    // ) internal override {
    //     address nftOwner = s_requestIdToSender[requestId];
    //     uint256 newTokenId = s_tokenCounter;

    //     uint256 moddedRng = randomWords[0] % i_maxNumberOfCollection;
    //     uint256 rarityRng = (randomWords[0] / moddedRng) % MAX_CHANCE_VALUE;

    //     Rarity rarity = getRarityFromRarityRng(rarityRng);
    //     s_tokenCounter++;

    //     _safeMint(nftOwner, newTokenId);

    //     s_mythNftToken[newTokenId] = TokenStructure({
    //         rarity: rarity,
    //         tokenUri: s_tokenUris[moddedRng]
    //     });

    //     emit NftMinted(newTokenId, rarity, nftOwner);
    // }

    function getRarityFromRarityRng(uint256 rarityRng) public pure returns (Rarity) {
        uint256 cumulativeSum = 0;
        uint256[3] memory chanceArray = getChanceArray();

        for (uint256 i = 0; i < chanceArray.length; i++) {
            if (rarityRng >= cumulativeSum && rarityRng < chanceArray[i]) {
                return Rarity(i);
            }
            cumulativeSum = chanceArray[i];
        }

        revert MythNft__RangeOutOfBounds();
    }

    function getChanceArray() public pure returns (uint256[3] memory) {
        return [90, 99, MAX_CHANCE_VALUE];
    }

    function getMintFee() public view returns (uint256) {
        return i_mintFee;
    }

    function getTokenUris(uint256 index) public view returns (string memory) {
        return s_tokenUris[index];
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }

    function getTokenByTokenId(uint256 tokenId) public view returns (TokenStructure memory) {
        return s_mythNftToken[tokenId];
    }

    function getMythToken() external view returns (address) {
        return i_mythTokenAddress;
    }
}
