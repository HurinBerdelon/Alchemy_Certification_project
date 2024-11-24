import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"
import { Contract } from "ethers"
import { ignition } from "hardhat"
import MythNftModule from "../../ignition/modules/MythNft"

describe("MythNft Contract", () => {
    let user: HardhatEthersSigner
    let externalContract: HardhatEthersSigner
    let mythNft: Contract

    beforeEach(async () => {
        const { contract: _mythNft } = await ignition.deploy(MythNftModule)
        mythNft = _mythNft
    })

    describe("Constructor", () => {
        it("should build contract with correct parameters")
    })
})
