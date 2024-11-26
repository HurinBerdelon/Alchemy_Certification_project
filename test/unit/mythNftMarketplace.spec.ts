import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"
import { ContractTransactionResponse } from "ethers"
import { ethers, network } from "hardhat"

import { BasicNft, MythNft, MythNftMarketplace, MythToken } from "../../typechain-types"
import { deployMythToken } from "../../script/01-deploy-MythToken"
import { deployMythNftMarketplace } from "../../script/03-deploy-MythNftMarketplace"
import { networkConfig } from "../../helper-hardhat-config"
import { expect } from "chai"
import { deployMock } from "../../script/00-deploy-mocks"

describe("MythNftMarketplace Contract", () => {
    const chainId = network.config.chainId ?? 31337
    const AMOUNT = networkConfig[chainId].mintFee ?? "500"
    let sellerUser: HardhatEthersSigner
    let buyerUser: HardhatEthersSigner

    let mythNftMarketplace: MythNftMarketplace & {
        deploymentTransaction(): ContractTransactionResponse
    }
    let mythToken: MythToken & {
        deploymentTransaction(): ContractTransactionResponse
    }

    let basicNft: BasicNft & {
        deploymentTransaction(): ContractTransactionResponse
    }

    let fundUser: (user?: HardhatEthersSigner, amount?: string) => Promise<{ userBalance: number }>
    let mintNftForUser: (user?: HardhatEthersSigner) => Promise<number>

    beforeEach(async () => {
        const accounts = await ethers.getSigners()
        sellerUser = accounts[0]
        buyerUser = accounts[1]

        mythToken = await deployMythToken()
        const mythTokenAddress = await mythToken.getAddress()

        mythNftMarketplace = await deployMythNftMarketplace({ mythTokenAddress, log: false })

        const contracts = await deployMock(false)
        basicNft = contracts.basicNft

        fundUser = async (_user = buyerUser, amount = AMOUNT) => {
            await mythToken.mintForUser(_user, amount)

            const userBalance = await mythToken.balanceOf(_user)

            return { userBalance: Number(userBalance) }
        }

        mintNftForUser = async () => {
            const basicNftForUser = basicNft.connect(sellerUser)
            const transactionResponse = await basicNftForUser.mintNft()
            const transactionReceipt = await transactionResponse.wait(1)

            // @ts-ignore
            return Number(transactionReceipt?.logs[1].args[0])
        }
    })

    describe("constructor", () => {
        it("should deploy contract with correct params", async () => {
            const mythTokenAddress = await mythNftMarketplace.getMythToken()

            expect(mythTokenAddress).equals(await mythToken.getAddress())
        })
    })

    describe("listItem", () => {
        it("should emit an event when listing an item", async () => {
            const tokenId = await mintNftForUser()
            const basicNftUser = basicNft.connect(sellerUser)
            const basicNftAddress = await basicNftUser.getAddress()

            const mythNftMarketplaceUser = mythNftMarketplace.connect(sellerUser)
            const mythNftMarketplaceUserAddress = await mythNftMarketplaceUser.getAddress()
            await basicNftUser.approve(mythNftMarketplaceUserAddress, tokenId)

            await expect(mythNftMarketplaceUser.listItem(basicNftAddress, tokenId, AMOUNT)).to.emit(
                mythNftMarketplaceUser,
                "ItemListed"
            )
        })

        it("should revert if price is equal or below zero", async () => {
            const tokenId = await mintNftForUser()
            const basicNftAddress = await basicNft.getAddress()

            const mythNftMarketplaceUser = mythNftMarketplace.connect(sellerUser)

            await expect(
                mythNftMarketplaceUser.listItem(basicNftAddress, tokenId, 0)
            ).to.be.revertedWithCustomError(
                mythNftMarketplaceUser,
                "MythNftMarketplace__PriceMustBeAboveZero"
            )
        })

        it("should revert if tokenId is not approved for marketplace", async () => {
            const tokenId = await mintNftForUser()
            const basicNftUser = basicNft.connect(sellerUser)
            const basicNftAddress = await basicNftUser.getAddress()

            const mythNftMarketplaceUser = mythNftMarketplace.connect(sellerUser)

            await expect(
                mythNftMarketplaceUser.listItem(basicNftAddress, tokenId, AMOUNT)
            ).to.be.revertedWithCustomError(
                mythNftMarketplaceUser,
                "MythNftMarketplace__NotApprovedForMarketplace"
            )
        })

        it("should revert if tokenId is already listed", async () => {
            const tokenId = await mintNftForUser()
            const basicNftUser = basicNft.connect(sellerUser)
            const basicNftAddress = await basicNftUser.getAddress()

            const mythNftMarketplaceUser = mythNftMarketplace.connect(sellerUser)
            const mythNftMarketplaceUserAddress = await mythNftMarketplaceUser.getAddress()
            await basicNftUser.approve(mythNftMarketplaceUserAddress, tokenId)

            await mythNftMarketplaceUser.listItem(basicNftAddress, tokenId, AMOUNT)

            await expect(
                mythNftMarketplaceUser.listItem(basicNftAddress, tokenId, AMOUNT)
            ).to.be.revertedWithCustomError(
                mythNftMarketplaceUser,
                "MythNftMarketplace__AlreadyListed"
            )
        })

        it("should revert if trying to list tokenId from another user", async () => {
            const tokenId = await mintNftForUser(sellerUser)
            const basicNftUser = basicNft.connect(sellerUser)
            const basicNftAddress = await basicNftUser.getAddress()

            const mythNftMarketplaceBuyer = mythNftMarketplace.connect(buyerUser)
            const mythNftMarketplaceUserAddress = await mythNftMarketplaceBuyer.getAddress()
            await basicNftUser.approve(mythNftMarketplaceUserAddress, tokenId)

            await expect(
                mythNftMarketplaceBuyer.listItem(basicNftAddress, tokenId, AMOUNT)
            ).to.be.revertedWithCustomError(mythNftMarketplaceBuyer, "MythNftMarketplace__NotOwner")
        })
    })

    describe("buyItem", () => {
        it("should emit an event when a NFT is bought", async () => {})
    })
})
