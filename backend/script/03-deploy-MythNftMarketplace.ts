import { ethers } from "hardhat"
import { mythTokenAddress } from "../helper-hardhat-config"
import { updateContractAddress } from "../utils/updateFrontendContractAddress"
import { updateFrontendAbi } from "../utils/updateFrontendAbi"

interface DeployMythNftParams {
    mythTokenAddress: string
    log?: boolean
    updateFrontend?: boolean
}

export const deployMythNftMarketplace = async ({
    mythTokenAddress,
    log = false,
    updateFrontend = false,
}: DeployMythNftParams) => {
    const contractName = "MythNftMarketplace"

    const contractFactory = await ethers.getContractFactory("MythNftMarketplace")
    const mythNftMarketplace = await contractFactory.deploy(mythTokenAddress)

    const contractAddress = await mythNftMarketplace.getAddress()

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
    mythTokenAddress: mythTokenAddress,
    log: true,
    updateFrontend: true,
}).catch((error) => console.log(error))
