import { buildModule } from "@nomicfoundation/ignition-core"
import { mythTokenAddress, networkConfig } from "../../helper-hardhat-config"
import { network } from "hardhat"

const MythNftModule = buildModule("MythNftModule", (module) => {
    const deployer = module.getAccount(0)
    const subscriptionId = module.getParameter("subscriptionId")
    const vrfClientAddress = module.getParameter("vrfClientAddress")

    const chainId = network.config.chainId ?? 31337

    const gaslane = networkConfig[chainId].gaslane
    const callbackGasLimit = networkConfig[chainId].callbackGasLimit
    const tokenUris = ""
    const mintFee = networkConfig[chainId].mintFee

    const args = [
        vrfClientAddress,
        subscriptionId,
        gaslane,
        callbackGasLimit,
        tokenUris,
        mintFee,
        mythTokenAddress,
    ]

    const contract = module.contract("MythNft", args, { from: deployer })

    return { contract }
})

export default MythNftModule
