import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"
import { ContractTransactionResponse } from "ethers"
import { ethers, network } from "hardhat"

import { BasicNft, MythNftMarketplace, MythToken } from "../../typechain-types"
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

        mythToken = await deployMythToken({ log: false })
        const mythTokenAddress = await mythToken.getAddress()

        mythNftMarketplace = await deployMythNftMarketplace({
            _mythTokenAddress: mythTokenAddress,
            log: false,
        })

        const contracts = await deployMock(false)
        basicNft = contracts.basicNft

        fundUser = async (_user = buyerUser, amount = AMOUNT) => {
            const mythTokenUser = mythToken.connect(_user)
            await mythTokenUser.fundMe(amount)

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

            const mythNftMarketplaceSellerUser = mythNftMarketplace.connect(sellerUser)
            const mythNftMarketplaceSellerUserAddress =
                await mythNftMarketplaceSellerUser.getAddress()
            await basicNftUser.approve(mythNftMarketplaceSellerUserAddress, tokenId)

            await expect(
                mythNftMarketplaceSellerUser.listItem(basicNftAddress, tokenId, AMOUNT)
            ).to.emit(mythNftMarketplaceSellerUser, "ItemListed")
        })

        it("should revert if price is equal or below zero", async () => {
            const tokenId = await mintNftForUser()
            const basicNftAddress = await basicNft.getAddress()

            const mythNftMarketplaceSellerUser = mythNftMarketplace.connect(sellerUser)

            await expect(
                mythNftMarketplaceSellerUser.listItem(basicNftAddress, tokenId, 0)
            ).to.be.revertedWithCustomError(
                mythNftMarketplaceSellerUser,
                "MythNftMarketplace__PriceMustBeAboveZero"
            )
        })

        it("should revert if tokenId is not approved for marketplace", async () => {
            const tokenId = await mintNftForUser()
            const basicNftUser = basicNft.connect(sellerUser)
            const basicNftAddress = await basicNftUser.getAddress()

            const mythNftMarketplaceSellerUser = mythNftMarketplace.connect(sellerUser)

            await expect(
                mythNftMarketplaceSellerUser.listItem(basicNftAddress, tokenId, AMOUNT)
            ).to.be.revertedWithCustomError(
                mythNftMarketplaceSellerUser,
                "MythNftMarketplace__NotApprovedForMarketplace"
            )
        })

        it("should revert if tokenId is already listed", async () => {
            const tokenId = await mintNftForUser()
            const basicNftUser = basicNft.connect(sellerUser)
            const basicNftAddress = await basicNftUser.getAddress()

            const mythNftMarketplaceSellerUser = mythNftMarketplace.connect(sellerUser)
            const mythNftMarketplaceSellerUserAddress =
                await mythNftMarketplaceSellerUser.getAddress()
            await basicNftUser.approve(mythNftMarketplaceSellerUserAddress, tokenId)

            await mythNftMarketplaceSellerUser.listItem(basicNftAddress, tokenId, AMOUNT)

            await expect(
                mythNftMarketplaceSellerUser.listItem(basicNftAddress, tokenId, AMOUNT)
            ).to.be.revertedWithCustomError(
                mythNftMarketplaceSellerUser,
                "MythNftMarketplace__AlreadyListed"
            )
        })

        it("should revert if trying to list tokenId from another user", async () => {
            const tokenId = await mintNftForUser(sellerUser)
            const basicNftUser = basicNft.connect(sellerUser)
            const basicNftAddress = await basicNftUser.getAddress()

            const mythNftMarketplaceBuyer = mythNftMarketplace.connect(buyerUser)
            const mythNftMarketplaceSellerUserAddress = await mythNftMarketplaceBuyer.getAddress()
            await basicNftUser.approve(mythNftMarketplaceSellerUserAddress, tokenId)

            await expect(
                mythNftMarketplaceBuyer.listItem(basicNftAddress, tokenId, AMOUNT)
            ).to.be.revertedWithCustomError(mythNftMarketplaceBuyer, "MythNftMarketplace__NotOwner")
        })
    })

    describe("buyItem", () => {
        it("should emit an event when a NFT is bought", async () => {
            const tokenId = await mintNftForUser()
            const basicNftUser = basicNft.connect(sellerUser)
            const basicNftAddress = await basicNftUser.getAddress()

            const mythNftMarketplaceSellerUser = mythNftMarketplace.connect(sellerUser)
            const mythNftMarketplaceSellerUserAddress =
                await mythNftMarketplaceSellerUser.getAddress()
            await basicNftUser.approve(mythNftMarketplaceSellerUserAddress, tokenId)
            await mythNftMarketplaceSellerUser.listItem(basicNftAddress, tokenId, AMOUNT)

            await fundUser(buyerUser, AMOUNT)
            const mythTokenBuyer = mythToken.connect(buyerUser)
            await mythTokenBuyer.approve(mythNftMarketplaceSellerUserAddress, AMOUNT)

            const mythNftMarketplaceBuyer = mythNftMarketplace.connect(buyerUser)

            await expect(mythNftMarketplaceBuyer.buyItem(basicNftAddress, tokenId)).to.emit(
                mythNftMarketplaceBuyer,
                "ItemBought"
            )
        })

        it("should revert if NFT is not listed", async () => {
            const tokenId = await mintNftForUser()
            const basicNftUser = basicNft.connect(sellerUser)
            const basicNftAddress = await basicNftUser.getAddress()

            await fundUser(buyerUser, AMOUNT)
            const mythNftMarketplaceBuyer = mythNftMarketplace.connect(buyerUser)

            await expect(
                mythNftMarketplaceBuyer.buyItem(basicNftAddress, tokenId)
            ).to.be.revertedWithCustomError(
                mythNftMarketplaceBuyer,
                "MythNftMarketplace__NotListed"
            )
        })
    })

    describe("cancelListing", () => {
        it("should be able for the owner to cancel listing", async () => {
            const tokenId = await mintNftForUser()
            const basicNftUser = basicNft.connect(sellerUser)
            const basicNftAddress = await basicNftUser.getAddress()

            const mythNftMarketplaceSellerUser = mythNftMarketplace.connect(sellerUser)
            const mythNftMarketplaceSellerUserAddress =
                await mythNftMarketplaceSellerUser.getAddress()
            await basicNftUser.approve(mythNftMarketplaceSellerUserAddress, tokenId)
            await mythNftMarketplaceSellerUser.listItem(basicNftAddress, tokenId, AMOUNT)

            expect(
                await mythNftMarketplaceSellerUser.cancelListing(basicNftAddress, tokenId)
            ).to.emit(mythNftMarketplaceSellerUser, "ItemCanceled")
        })

        it("should revert if NFT is not listed", async () => {
            const tokenId = await mintNftForUser()
            const basicNftUser = basicNft.connect(sellerUser)
            const basicNftAddress = await basicNftUser.getAddress()

            const mythNftMarketplaceSellerUser = mythNftMarketplace.connect(sellerUser)

            await expect(
                mythNftMarketplaceSellerUser.cancelListing(basicNftAddress, tokenId)
            ).to.be.revertedWithCustomError(
                mythNftMarketplaceSellerUser,
                "MythNftMarketplace__NotListed"
            )
        })

        it("should revert if not owner user trying to cancel listing", async () => {
            const tokenId = await mintNftForUser()
            const basicNftUser = basicNft.connect(sellerUser)
            const basicNftAddress = await basicNftUser.getAddress()

            const mythNftMarketplaceSellerUser = mythNftMarketplace.connect(sellerUser)
            const mythNftMarketplaceSellerUserAddress =
                await mythNftMarketplaceSellerUser.getAddress()
            await basicNftUser.approve(mythNftMarketplaceSellerUserAddress, tokenId)
            await mythNftMarketplaceSellerUser.listItem(basicNftAddress, tokenId, AMOUNT)

            const mythNftMarketplaceBuyer = mythNftMarketplace.connect(buyerUser)

            await expect(
                mythNftMarketplaceBuyer.cancelListing(basicNftAddress, tokenId)
            ).to.be.revertedWithCustomError(mythNftMarketplaceBuyer, "MythNftMarketplace__NotOwner")
        })
    })

    describe("updateListing", () => {
        it("should be able for the owner to update listing", async () => {
            const tokenId = await mintNftForUser()
            const basicNftUser = basicNft.connect(sellerUser)
            const basicNftAddress = await basicNftUser.getAddress()

            const mythNftMarketplaceSellerUser = mythNftMarketplace.connect(sellerUser)
            const mythNftMarketplaceSellerUserAddress =
                await mythNftMarketplaceSellerUser.getAddress()
            await basicNftUser.approve(mythNftMarketplaceSellerUserAddress, tokenId)
            await mythNftMarketplaceSellerUser.listItem(basicNftAddress, tokenId, AMOUNT)

            expect(
                mythNftMarketplaceSellerUser.updateListing(
                    basicNftAddress,
                    tokenId,
                    Number(AMOUNT) / 2
                )
            ).to.emit(mythNftMarketplaceSellerUser, "ItemListed")
        })

        it("should not update listing if new price is equal or lower than zero", async () => {
            const tokenId = await mintNftForUser()
            const basicNftUser = basicNft.connect(sellerUser)
            const basicNftAddress = await basicNftUser.getAddress()

            const mythNftMarketplaceSellerUser = mythNftMarketplace.connect(sellerUser)
            const mythNftMarketplaceSellerUserAddress =
                await mythNftMarketplaceSellerUser.getAddress()
            await basicNftUser.approve(mythNftMarketplaceSellerUserAddress, tokenId)
            await mythNftMarketplaceSellerUser.listItem(basicNftAddress, tokenId, AMOUNT)

            expect(
                mythNftMarketplaceSellerUser.updateListing(basicNftAddress, tokenId, 0)
            ).to.be.revertedWithCustomError(
                mythNftMarketplaceSellerUser,
                "MythNftMarketplace__PriceMustBeAboveZero"
            )
        })

        it("should not be able to update a NFT if it is not listed", async () => {
            const tokenId = await mintNftForUser()
            const basicNftUser = basicNft.connect(sellerUser)
            const basicNftAddress = await basicNftUser.getAddress()

            const mythNftMarketplaceSellerUser = mythNftMarketplace.connect(sellerUser)

            await expect(
                mythNftMarketplaceSellerUser.updateListing(basicNftAddress, tokenId, AMOUNT)
            ).to.be.revertedWithCustomError(
                mythNftMarketplaceSellerUser,
                "MythNftMarketplace__NotListed"
            )
        })

        it("should not be able for not owner user to update listing", async () => {
            const tokenId = await mintNftForUser()
            const basicNftUser = basicNft.connect(sellerUser)
            const basicNftAddress = await basicNftUser.getAddress()

            const mythNftMarketplaceSellerUser = mythNftMarketplace.connect(sellerUser)
            const mythNftMarketplaceSellerUserAddress =
                await mythNftMarketplaceSellerUser.getAddress()
            await basicNftUser.approve(mythNftMarketplaceSellerUserAddress, tokenId)
            await mythNftMarketplaceSellerUser.listItem(basicNftAddress, tokenId, AMOUNT)

            const mythNftMarketplaceBuyer = mythNftMarketplace.connect(buyerUser)

            await expect(
                mythNftMarketplaceBuyer.updateListing(basicNftAddress, tokenId, AMOUNT)
            ).to.be.revertedWithCustomError(mythNftMarketplaceBuyer, "MythNftMarketplace__NotOwner")
        })
    })

    describe("getListingByTokenId", () => {
        it("should return listing by tokenId", async () => {
            const tokenId = await mintNftForUser()
            const basicNftUser = basicNft.connect(sellerUser)
            const basicNftAddress = await basicNftUser.getAddress()

            const mythNftMarketplaceSellerUser = mythNftMarketplace.connect(sellerUser)
            const mythNftMarketplaceSellerUserAddress =
                await mythNftMarketplaceSellerUser.getAddress()
            await basicNftUser.approve(mythNftMarketplaceSellerUserAddress, tokenId)
            await mythNftMarketplaceSellerUser.listItem(basicNftAddress, tokenId, AMOUNT)

            const listing = await mythNftMarketplace.getListingByTokenId(basicNftAddress, tokenId)

            expect(listing[0].toString()).equals(AMOUNT)
            expect(listing[1]).equals(sellerUser.address)
        })
    })
})
