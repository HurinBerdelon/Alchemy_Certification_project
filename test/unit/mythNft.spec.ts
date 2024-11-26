import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"
import { ContractTransactionResponse } from "ethers"
import { ethers, network } from "hardhat"
import { expect } from "chai"

import { deployMythNft } from "../../script/02-deploy-MythNft"
import { networkConfig } from "../../helper-hardhat-config"
import { MythNft, MythToken, VRFCoordinatorV2_5Mock } from "../../typechain-types"
import tokenUrisMock from "../mock/tokenUrisMock.json"
import { deployMythToken } from "../../script/01-deploy-MythToken"

describe("MythNft Contract", () => {
    const outOfBoundsRarityRng = 150
    let user: HardhatEthersSigner
    let mythNft: MythNft & {
        deploymentTransaction(): ContractTransactionResponse
    }
    let mythToken: MythToken & {
        deploymentTransaction(): ContractTransactionResponse
    }
    let vrfCoordinatorV2_5Mock: VRFCoordinatorV2_5Mock & {
        deploymentTransaction(): ContractTransactionResponse
    }
    const chainId = network.config.chainId ?? 31337
    let fundUser: (user?: HardhatEthersSigner, amount?: string) => Promise<{ userBalance: number }>
    const mintFee = networkConfig[chainId].mintFee ?? "500"

    beforeEach(async () => {
        const accounts = await ethers.getSigners()
        user = accounts[1]

        mythToken = await deployMythToken()
        const mythTokenAddress = await mythToken.getAddress()

        const contracts = await deployMythNft({
            tokenUris: tokenUrisMock,
            maxNumberOfCollection: tokenUrisMock.length,
            _mythTokenAddress: mythTokenAddress,
            log: false,
        })

        mythNft = contracts.mythNft
        vrfCoordinatorV2_5Mock = contracts.vrfCoordinatorV2_5Mock as VRFCoordinatorV2_5Mock & {
            deploymentTransaction(): ContractTransactionResponse
        }

        fundUser = async (_user = user, amount = mintFee) => {
            await mythToken.mintForUser(_user, amount)

            const userBalance = await mythToken.balanceOf(_user)

            return { userBalance: Number(userBalance) }
        }
    })

    describe("Constructor", () => {
        it("should build contract with correct parameters", async () => {
            const mintFee = await mythNft.getMintFee()
            const tokenUri = await mythNft.getTokenUris(0)
            const _mythTokenAddress = await mythNft.getMythToken()

            expect(mintFee).equals(networkConfig[chainId].mintFee)
            expect(tokenUri).equals(tokenUrisMock[0])
            expect(_mythTokenAddress).equals(await mythToken.getAddress())
        })
    })

    describe("requestNft", () => {
        it("should be able to return random number", async () => {
            await fundUser()
            const mythNftUser = mythNft.connect(user)
            const mythTokenUser = mythToken.connect(user)
            mythTokenUser.approve(await mythNftUser.getAddress(), mintFee)

            await expect(mythNftUser.requestNft(mintFee)).to.emit(mythNft, "NftRequested")
        })

        it("should revert if user doesn't pay enough token", async () => {
            await fundUser()
            const mythNftUser = mythNft.connect(user)
            const mythTokenUser = mythToken.connect(user)
            mythTokenUser.approve(await mythNftUser.getAddress(), mintFee)

            await expect(mythNftUser.requestNft(0)).to.be.revertedWithCustomError(
                mythNftUser,
                "MythNft__NotEnoughTokensPaid"
            )
        })

        it("should revert if user doesn't have enough balance", async () => {
            const mythNftUser = mythNft.connect(user)
            const mythTokenUser = mythToken.connect(user)
            mythTokenUser.approve(await mythNftUser.getAddress(), mintFee)

            await expect(mythNftUser.requestNft(mintFee)).to.be.reverted
        })
    })

    describe("fulfillRandomWords", () => {
        it("should mint NFT after generating a random number", async () => {
            await fundUser()
            const mythNftUser = mythNft.connect(user)
            const mythTokenUser = mythToken.connect(user)
            mythTokenUser.approve(await mythNftUser.getAddress(), mintFee)

            await new Promise<void>(async (resolve, reject) => {
                //@ts-ignore
                mythNftUser.once("NftMinted", async () => {
                    try {
                        const tokenUri = await mythNftUser.getTokenUris(0)

                        expect(tokenUri.toString()).equals(tokenUrisMock[0])
                        resolve()
                    } catch (error) {
                        console.log(error)
                        reject(error)
                    }
                })

                try {
                    const transactionResponse = await mythNftUser.requestNft(mintFee)
                    const transactionReceipt = await transactionResponse.wait(1)

                    await vrfCoordinatorV2_5Mock.fulfillRandomWords(
                        // @ts-ignore
                        transactionReceipt?.logs[2].args[0],
                        await mythNftUser.getAddress()
                    )
                } catch (error) {
                    console.log(error)
                    reject(error)
                }
            })
        })
    })

    describe("getRarityFromRarityRng", () => {
        it("should return a rarity from a rarityRng", async () => {
            const rarity = await mythNft.getRarityFromRarityRng(95)

            expect(rarity).equals(BigInt(1))
        })

        it("should revert if rarityRng is out of bounds (it means, over 100)", async () => {
            await expect(
                mythNft.getRarityFromRarityRng(outOfBoundsRarityRng)
            ).to.be.revertedWithCustomError(mythNft, "MythNft__RangeOutOfBounds")
        })
    })

    describe("getChanceArray", () => {
        it("should create the rarity chance array", async () => {
            const chanceArray = await mythNft.getChanceArray()

            expect(chanceArray[0]).equals(BigInt(90))
            expect(chanceArray[1]).equals(BigInt(99))
            expect(chanceArray[2]).equals(BigInt(100))
        })
    })

    describe("getTokenByTokenId", () => {})
})
