import { ethers, network } from "hardhat"
import { developmentChains, mythTokenAddress } from "../helper-hardhat-config"
import verify from "../utils/verify"

interface DeployMythNftParams {
    _mythTokenAddress: string
    log?: boolean
}

export const deployMythNftMarketplace = async ({
    _mythTokenAddress,
    log = false,
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

    return mythNftMarketplace
}

deployMythNftMarketplace({
    _mythTokenAddress: mythTokenAddress,
    log: true,
}).catch((error) => console.log(error))
