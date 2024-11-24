import { ethers, ignition } from "hardhat"
import { expect } from "chai"
import MythTokenModule from "../../ignition/modules/MythToken"
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"
import { Contract } from "ethers"
import { MythToken } from "../../typechain-types"

describe("MythToken Contract", () => {
    let user: HardhatEthersSigner
    let externalContract: HardhatEthersSigner
    let sellerUser: HardhatEthersSigner
    let mythToken: Contract
    let fundUser: (user?: HardhatEthersSigner, amount?: number) => Promise<{ userBalance: number }>
    const AMOUNT = 500

    beforeEach(async () => {
        const accounts = await ethers.getSigners()
        user = accounts[1]
        externalContract = accounts[2]
        sellerUser = accounts[3]

        const { contract: _mythToken } = await ignition.deploy(MythTokenModule)
        mythToken = _mythToken

        fundUser = async (_user = user, amount = AMOUNT) => {
            await mythToken.mintForUser(_user, amount)

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

            expect(totalSupply.toString()).equals((1e9).toString())
            expect(balanceOfOwner.toString()).equals(totalSupply.toString())
        })
    })

    describe("mintForUser", () => {
        it("should transfer an amount to an user", async () => {
            await fundUser()

            const totalSupply = await mythToken.totalSupply()
            const balanceOfContract = await mythToken.balanceOf(mythToken.getAddress())
            const balanceOfUser = await mythToken.balanceOf(user)

            expect(Number(balanceOfContract)).equals(Number(totalSupply) - AMOUNT)
            expect(Number(balanceOfUser)).equals(AMOUNT)
        })
    })

    describe("handleMintNft", () => {
        it("should be able to spend tokens from user and assign to the contract when minting a NFT", async () => {
            const mintFee = AMOUNT / 2
            await fundUser()

            const mythTokenMinter = mythToken.connect(user) as MythToken
            mythTokenMinter.approve(externalContract, mintFee)

            const mythTokenExternal = mythToken.connect(externalContract) as MythToken
            await mythTokenExternal.handleMintNFT(user, mintFee)

            const totalSupply = await mythToken.totalSupply()
            const balanceOfContract = await mythToken.balanceOf(mythToken.getAddress())
            const balanceOfUser = await mythToken.balanceOf(user)

            expect(Number(balanceOfContract)).equals(Number(totalSupply) - AMOUNT + mintFee)
            expect(Number(balanceOfUser)).equals(AMOUNT - mintFee)
        })

        it("should not be able to spend tokens to mint an NFT if user has not enough balance", async () => {
            const mintFee = AMOUNT / 2
            const mythTokenMinter = mythToken.connect(user) as MythToken
            mythTokenMinter.approve(externalContract, mintFee)

            const mythTokenExternal = mythToken.connect(externalContract) as MythToken

            await expect(
                mythTokenExternal.handleMintNFT(user, mintFee)
            ).to.be.revertedWithCustomError(mythTokenExternal, "MythToken__NotEnoughToken")
        })
    })

    describe("handleBuy", () => {
        it("should be able to spend tokens to buy an NFT", async () => {
            const PRICE = AMOUNT / 2
            const { userBalance: buyerBalanceBeforePurchase } = await fundUser(user)

            const mythTokenBuyer = mythToken.connect(user) as MythToken
            mythTokenBuyer.approve(externalContract, PRICE)

            const mythTokenExternal = mythToken.connect(externalContract) as MythToken
            await mythTokenExternal.handleBuy(user, sellerUser, PRICE)

            const buyerBalanceAfterPurchase = await mythToken.balanceOf(user)

            expect(Number(buyerBalanceAfterPurchase)).equals(buyerBalanceBeforePurchase - PRICE)
        })

        it("should set seller's proceeds after handleBuy", async () => {
            const PRICE = AMOUNT / 2
            await fundUser(user)

            const mythTokenBuyer = mythToken.connect(user) as MythToken
            mythTokenBuyer.approve(externalContract, PRICE)

            const mythTokenExternal = mythToken.connect(externalContract) as MythToken
            await mythTokenExternal.handleBuy(user, sellerUser, PRICE)

            const mythTokenSeller = mythToken.connect(sellerUser) as MythToken
            const sellerProceeds = await mythTokenSeller.getProceeds()

            expect(Number(sellerProceeds)).equals(PRICE)
        })

        it("should not buy item if buyer does not have enough funds", async () => {
            const PRICE = AMOUNT / 2

            const mythTokenBuyer = mythToken.connect(user) as MythToken
            mythTokenBuyer.approve(externalContract, PRICE)

            const mythTokenExternal = mythToken.connect(externalContract) as MythToken

            await expect(
                mythTokenExternal.handleBuy(user, sellerUser, PRICE)
            ).to.be.revertedWithCustomError(mythTokenExternal, "MythToken__NotEnoughToken")
        })
    })

    describe("withdrawProceeds", () => {
        it("should allow seller to withdraw proceeds", async () => {
            const PRICE = AMOUNT / 2
            await fundUser(user)

            const mythTokenBuyer = mythToken.connect(user) as MythToken
            mythTokenBuyer.approve(externalContract, PRICE)

            const mythTokenExternal = mythToken.connect(externalContract) as MythToken
            await mythTokenExternal.handleBuy(user, sellerUser, PRICE)

            const mythTokenSeller = mythToken.connect(sellerUser) as MythToken
            await mythTokenSeller.withdrawProceeds()
            const sellerBalance = await mythTokenSeller.balanceOf(sellerUser)

            expect(Number(sellerBalance)).equals(PRICE)
        })

        it("should not allow seller to withdraw zero proceeds", async () => {
            const mythTokenSeller = mythToken.connect(sellerUser) as MythToken

            await expect(mythTokenSeller.withdrawProceeds()).to.be.revertedWithCustomError(
                mythTokenSeller,
                "MythToken__NoProceeds"
            )
        })
    })
})
