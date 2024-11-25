import { buildModule } from "@nomicfoundation/ignition-core"
import { networkConfig } from "../../helper-hardhat-config"
import { network } from "hardhat"

const MythNftModule = buildModule("MythNftModule", (module) => {
    const subscriptionId = module.getParameter("subscriptionId")
    const vrfClientAddress = module.getParameter("vrfClientAddress")
    const mythTokenAddress = module.getParameter("mythTokenAddress")
    const tokenUris = module.getParameter("tokenUris")
    const maxNumberOfCollection = module.getParameter("maxNumberOfCollection")

    const chainId = network.config.chainId ?? 31337

    const gaslane = networkConfig[chainId].gaslane
    const callbackGasLimit = networkConfig[chainId].callbackGasLimit
    const mintFee = networkConfig[chainId].mintFee

    const args = [
        vrfClientAddress,
        subscriptionId,
        gaslane,
        callbackGasLimit,
        maxNumberOfCollection,
        tokenUris,
        mintFee,
        mythTokenAddress,
    ]

    const contract = module.contract("MythNft", args)

    return { contract }
})

export default MythNftModule
