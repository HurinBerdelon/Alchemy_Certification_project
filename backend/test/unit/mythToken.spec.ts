import { ethers } from "hardhat"
import { expect } from "chai"
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"
import { ContractTransactionResponse } from "ethers"
import { time } from "@nomicfoundation/hardhat-network-helpers"

import { MythToken } from "../../typechain-types"
import { deployMythToken } from "../../script/01-deploy-MythToken"
import { initialSupply } from "../../helper-hardhat-config"

describe("MythToken Contract", () => {
    let user: HardhatEthersSigner
    let externalContract: HardhatEthersSigner
    let sellerUser: HardhatEthersSigner
    let mythToken: MythToken & {
        deploymentTransaction(): ContractTransactionResponse
    }
    let fundUser: (user?: HardhatEthersSigner, amount?: number) => Promise<{ userBalance: number }>
    const AMOUNT = 500
    const mintFee = AMOUNT / 2

    beforeEach(async () => {
        const accounts = await ethers.getSigners()
        user = accounts[1]
        externalContract = accounts[2]
        sellerUser = accounts[3]

        mythToken = await deployMythToken({ log: false, updateFrontend: false })

        fundUser = async (_user = user, amount = AMOUNT) => {
            const mythTokenUser = mythToken.connect(_user)
            await mythTokenUser.fundMe(amount)

            const userBalance = await mythToken.balanceOf(_user)

            return { userBalance: Number(userBalance) }
        }
    })

    describe("Constructor", () => {
        it("should build contract with correct name, symbol", async () => {
            const name = await mythToken.name()
            const symbol = await mythToken.symbol()

            expect(name).equals("Myth Token Coin")
            expect(symbol).equals("MTC")
        })

        it("should mint initialSupply tokens to the contract", async () => {
            const totalSupply = await mythToken.totalSupply()
            const balanceOfOwner = await mythToken.balanceOf(mythToken.getAddress())

            expect(totalSupply.toString()).equals(BigInt(initialSupply).toString())
            expect(balanceOfOwner.toString()).equals(totalSupply.toString())
        })
    })

    describe("fundMe", () => {
        it("should emit an event when minting some tokens for the user", async () => {
            const mythTokenUser = mythToken.connect(user)
            await expect(mythTokenUser.fundMe(AMOUNT)).to.emit(mythToken, "UserFunded")
        })

        it("should transfer an amount to an user", async () => {
            await fundUser()

            const totalSupply = await mythToken.totalSupply()
            const balanceOfContract = await mythToken.balanceOf(mythToken.getAddress())
            const balanceOfUser = await mythToken.balanceOf(user)

            expect(Number(balanceOfContract)).equals(Number(totalSupply) - AMOUNT)
            expect(Number(balanceOfUser)).equals(AMOUNT)
        })

        it("should fund user again after 24 hours have passed", async () => {
            await fundUser()
            const balanceOfUser = await mythToken.balanceOf(user)

            await time.increase(24 * 60 * 60) // 24 hours

            await fundUser()

            const balanceOfUserAfterSecondFund = await mythToken.balanceOf(user)

            expect(Number(balanceOfUser)).equals(AMOUNT)
            expect(Number(balanceOfUserAfterSecondFund)).equals(AMOUNT * 2)
        })

        it("should not fund user if there is less than 24*60*60 seconds (24 hours) from last fund", async () => {
            await fundUser(user)

            const mythTokenUser = mythToken.connect(user)

            await expect(mythTokenUser.fundMe(AMOUNT)).to.be.revertedWithCustomError(
                mythToken,
                "MythToken__CannotFundUser"
            )
        })
    })

    describe("handleMintNft", () => {
        it("should be able to spend tokens from user and assign to the contract when minting a NFT", async () => {
            await fundUser()

            const mythTokenMinter = mythToken.connect(user)
            mythTokenMinter.approve(externalContract, mintFee)

            const mythTokenExternal = mythToken.connect(externalContract)
            await mythTokenExternal.handleMintNFT(user, mintFee)

            const totalSupply = await mythToken.totalSupply()
            const balanceOfContract = await mythToken.balanceOf(mythToken.getAddress())
            const balanceOfUser = await mythToken.balanceOf(user)

            expect(Number(balanceOfContract)).equals(Number(totalSupply) - AMOUNT + mintFee)
            expect(Number(balanceOfUser)).equals(AMOUNT - mintFee)
        })

        it("should not be able to spend tokens to mint a NFT if user has not enough balance", async () => {
            const mythTokenMinter = mythToken.connect(user)
            mythTokenMinter.approve(externalContract, mintFee)

            const mythTokenExternal = mythToken.connect(externalContract)

            await expect(
                mythTokenExternal.handleMintNFT(user, mintFee)
            ).to.be.revertedWithCustomError(mythTokenExternal, "MythToken__NotEnoughBalance")
        })
    })

    describe("handleBuy", () => {
        it("should be able to spend tokens to buy an NFT", async () => {
            const PRICE = AMOUNT / 2
            const { userBalance: buyerBalanceBeforePurchase } = await fundUser(user)

            const mythTokenBuyer = mythToken.connect(user)
            mythTokenBuyer.approve(externalContract, PRICE)

            const mythTokenExternal = mythToken.connect(externalContract)
            await mythTokenExternal.handleBuy(user, sellerUser, PRICE)

            const buyerBalanceAfterPurchase = await mythToken.balanceOf(user)

            expect(Number(buyerBalanceAfterPurchase)).equals(buyerBalanceBeforePurchase - PRICE)
        })

        it("should set seller's proceeds after handleBuy", async () => {
            const PRICE = AMOUNT / 2
            await fundUser(user)

            const mythTokenBuyer = mythToken.connect(user)
            mythTokenBuyer.approve(externalContract, PRICE)

            const mythTokenExternal = mythToken.connect(externalContract)
            await mythTokenExternal.handleBuy(user, sellerUser, PRICE)

            const mythTokenSeller = mythToken.connect(sellerUser)
            const sellerProceeds = await mythTokenSeller.getProceeds()

            expect(Number(sellerProceeds)).equals(PRICE)
        })

        it("should not buy item if buyer does not have enough funds", async () => {
            const PRICE = AMOUNT / 2

            const mythTokenBuyer = mythToken.connect(user)
            mythTokenBuyer.approve(externalContract, PRICE)

            const mythTokenExternal = mythToken.connect(externalContract)

            await expect(
                mythTokenExternal.handleBuy(user, sellerUser, PRICE)
            ).to.be.revertedWithCustomError(mythTokenExternal, "MythToken__NotEnoughBalance")
        })
    })

    describe("withdrawProceeds", () => {
        it("should allow seller to withdraw proceeds", async () => {
            const PRICE = AMOUNT / 2
            await fundUser(user)

            const mythTokenBuyer = mythToken.connect(user)
            mythTokenBuyer.approve(externalContract, PRICE)

            const mythTokenExternal = mythToken.connect(externalContract)
            await mythTokenExternal.handleBuy(user, sellerUser, PRICE)

            const mythTokenSeller = mythToken.connect(sellerUser)
            await mythTokenSeller.withdrawProceeds()
            const sellerBalance = await mythTokenSeller.balanceOf(sellerUser)

            expect(Number(sellerBalance)).equals(PRICE)
        })

        it("should not allow seller to withdraw zero proceeds", async () => {
            const mythTokenSeller = mythToken.connect(sellerUser)

            await expect(mythTokenSeller.withdrawProceeds()).to.be.revertedWithCustomError(
                mythTokenSeller,
                "MythToken__NoProceeds"
            )
        })
    })

    describe("getFrequency", () => {
        it("should get the frequency of funds", async () => {
            await fundUser(user)

            const mythTokenUser = mythToken.connect(user)

            const frequency = await mythTokenUser.getFrequency()

            expect(frequency[0].toString()).equal((1).toString())
            expect(Number(frequency[1])).to.be.above(0)
        })
    })
})
