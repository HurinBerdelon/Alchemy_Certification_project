import { ethers, network } from "hardhat"
import { developmentChains, mythTokenAddress } from "../helper-hardhat-config"
import { updateContractAddress } from "../utils/updateFrontendContractAddress"
import { updateFrontendAbi } from "../utils/updateFrontendAbi"
import verify from "../utils/verify"

interface DeployMythNftParams {
    _mythTokenAddress: string
    log?: boolean
    updateFrontend?: boolean
}

export const deployMythNftMarketplace = async ({
    _mythTokenAddress,
    log = false,
    updateFrontend = false,
}: DeployMythNftParams) => {
    const contractName = "MythNftMarketplace"

    const contractFactory = await ethers.getContractFactory("MythNftMarketplace")
    const mythNftMarketplace = await contractFactory.deploy(_mythTokenAddress)

    const contractAddress = await mythNftMarketplace.getAddress()

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(contractAddress, [_mythTokenAddress])
    }

    if (log) {
        console.log(`===> contract ${contractName} deployed to ${contractAddress}`)
    }

    if (updateFrontend) {
        try {
            updateContractAddress({ contractName, address: contractAddress })
            updateFrontendAbi({ contractName })
        } catch (error) {
            console.log(error)
        }
    }

    return mythNftMarketplace
}

deployMythNftMarketplace({
    _mythTokenAddress: mythTokenAddress,
    log: true,
    updateFrontend: true,
}).catch((error) => console.log(error))
