import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"
import { Contract } from "ethers"
import { ignition, network } from "hardhat"
import MythNftModule from "../../ignition/modules/MythNft"
import { deployMythNft } from "../../script/01-deploy-MythNft"
import MythTokenModule from "../../ignition/modules/MythToken"
import { expect } from "chai"
import { networkConfig } from "../../helper-hardhat-config"

describe("MythNft Contract", () => {
    let user: HardhatEthersSigner
    let externalContract: HardhatEthersSigner
    let mythNft: Contract
    let mythTokenAddress: string
    const chainId = network.config.chainId ?? 31337

    beforeEach(async () => {
        const { contract: _mythToken } = await ignition.deploy(MythTokenModule)
        mythTokenAddress = await _mythToken.getAddress()

        const { contract: _mythNft } = await deployMythNft({ _mythTokenAddress: mythTokenAddress })
        mythNft = _mythNft
    })

    describe("Constructor", () => {
        it("should build contract with correct parameters", async () => {
            const mintFee = await mythNft.getMintFee()
            const tokenUris = await mythNft.getTokenUris()
            const _mythTokenAddress = await mythNft.getMythToken()

            expect(mintFee).equals(networkConfig[chainId].mintFee)
            expect(tokenUris).equals("")
            expect(_mythTokenAddress).equals(mythTokenAddress)
        })
    })
})
