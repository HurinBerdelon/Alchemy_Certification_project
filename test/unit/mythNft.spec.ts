import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"
import { Contract } from "ethers"
import { ethers, ignition, network } from "hardhat"
import { deployMythNft } from "../../script/02-deploy-MythNft"
import MythTokenModule from "../../ignition/modules/MythToken"
import { expect } from "chai"
import { networkConfig } from "../../helper-hardhat-config"
import { MythNft, MythToken } from "../../typechain-types"
import tokenUrisMock from "../mock/tokenUrisMock.json"

describe("MythNft Contract", () => {
    let user: HardhatEthersSigner
    let externalContract: HardhatEthersSigner
    let mythNft: Contract
    let mythToken: Contract
    const chainId = network.config.chainId ?? 31337
    let fundUser: (user?: HardhatEthersSigner, amount?: number) => Promise<{ userBalance: number }>
    const AMOUNT = networkConfig[chainId].mintFee ?? "500"
    const mintFee = Number(AMOUNT)

    beforeEach(async () => {
        const accounts = await ethers.getSigners()
        user = accounts[1]
        externalContract = accounts[2]

        const { contract: _mythToken } = await ignition.deploy(MythTokenModule)
        mythToken = _mythToken
        const mythTokenAddress = await _mythToken.getAddress()

        const { contract: _mythNft } = await deployMythNft({
            tokenUris: tokenUrisMock,
            maxNumberOfCollection: tokenUrisMock.length,
            _mythTokenAddress: mythTokenAddress,
        })
        mythNft = _mythNft

        fundUser = async (_user = user, amount = Number(AMOUNT)) => {
            await mythToken.mintForUser(_user, 500)

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
        // it("should be able to mint an NFT", async () => {
        //     await fundUser()
        //     const mythNftUser = mythNft.connect(user) as MythNft
        //     const mythTokenUser = mythToken.connect(user) as MythToken
        //     mythTokenUser.approve(await mythNftUser.getAddress(), mintFee)
        //     await expect(mythNftUser.requestNft(mintFee)).to.emit(mythNft, "NftRequested")
        // })
        // it("should revert if user doesn't pay enough token", async () => {
        //     await fundUser()
        //     const mythNftUser = mythNft.connect(user) as MythNft
        //     const mythTokenUser = mythToken.connect(user) as MythToken
        //     mythTokenUser.approve(await mythNftUser.getAddress(), mintFee)
        //     await expect(mythNftUser.requestNft(0)).to.be.revertedWithCustomError(
        //         mythNftUser,
        //         "MythNft__NotEnoughTokensPaid"
        //     )
        // })
        // it("should revert if user doesn't have enough balance", async () => {
        //     const mythNftUser = mythNft.connect(user) as MythNft
        //     const mythTokenUser = mythToken.connect(user) as MythToken
        //     mythTokenUser.approve(await mythNftUser.getAddress(), mintFee)
        //     const _mintFee = await mythNftUser.getMintFee()
        //     console.log({ _mintFee, mintFee })
        //     await expect(mythNftUser.requestNft(mintFee)).to.be.revertedWithCustomError(
        //         mythNftUser,
        //         "MythNft__NotEnoughBalance"
        //     )
        // })
    })
})
