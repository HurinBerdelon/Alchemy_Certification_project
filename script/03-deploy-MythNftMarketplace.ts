import { ethers } from "hardhat"
import { mythTokenAddress } from "../helper-hardhat-config"

interface DeployMythNftParams {
    mythTokenAddress: string
    log?: boolean
}

export const deployMythNftMarketplace = async ({
    mythTokenAddress,
    log = false,
}: DeployMythNftParams) => {
    const contractName = "MythNftMarketplace"

    const contractFactory = await ethers.getContractFactory("MythNftMarketplace")
    const mythNftMarketplace = await contractFactory.deploy(mythTokenAddress)

    const contractAddress = await mythNftMarketplace.getAddress()

    if (log) {
        console.log(`===> contract ${contractName} deployed to ${contractAddress}`)
    }

    return mythNftMarketplace
}

deployMythNftMarketplace({ mythTokenAddress: mythTokenAddress, log: true }).catch((error) =>
    console.log(error)
)
