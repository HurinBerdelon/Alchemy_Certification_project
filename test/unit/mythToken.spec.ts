import { ethers, ignition, network } from "hardhat"
import { developmentChains } from "../../helper-hardhat-config"
import { expect } from "chai"
import MythTokenModule from "../../ignition/modules/MythToken"
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"
import { Contract } from "ethers"

describe("Myth Token Contract", () => {
    let deployer: HardhatEthersSigner
    let secondUser: HardhatEthersSigner
    let mythToken: Contract
    const AMOUNT = 500

    beforeEach(async () => {
        const accounts = await ethers.getSigners()
        deployer = accounts[0]
        secondUser = accounts[1]

        const { contract: _mythToken } = await ignition.deploy(MythTokenModule)
        mythToken = _mythToken
    })

    it("should construct contract with correct name, symbol", async () => {
        const name = await mythToken.name()
        const symbol = await mythToken.symbol()

        expect(name).equals("Myth Token Coin")
        expect(symbol).equals("MTC")
    })

    it("should mint tokens for the deployer", async () => {
        const totalSupply = await mythToken.totalSupply()
        const balanceOfOwner = await mythToken.balanceOf(deployer)

        expect(totalSupply.toString()).equals((1e9).toString())
        expect(balanceOfOwner.toString()).equals(totalSupply.toString())
    })

    it("should transfer an amount to an user", async () => {
        await mythToken.approve(deployer, AMOUNT)
        await mythToken.transferFrom(deployer, secondUser, AMOUNT)

        const totalSupply = await mythToken.totalSupply()
        const balanceOfOwner = await mythToken.balanceOf(deployer)
        const balanceOfUser = await mythToken.balanceOf(secondUser)

        expect(balanceOfOwner.toString()).equals((totalSupply - balanceOfUser).toString())
        expect(balanceOfUser.toString()).equals(AMOUNT.toString())
    })

    it("should get owner", async () => {
        const owner = await mythToken.getOwner()

        expect(owner).equals(deployer)
    })

    it("should be able to transfer tokens from owner to an user", () => {})

    it("should be able to remove tokens from user and assign to owner when minting a NFT", async () => {
        await mythToken.handleMint(secondUser, AMOUNT)
    })
})
