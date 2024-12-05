import { ethers, network } from "hardhat"
import { updateContractAddress } from "../utils/updateFrontendContractAddress"
import { updateFrontendAbi } from "../utils/updateFrontendAbi"
import { developmentChains } from "../helper-hardhat-config"
import verify from "../utils/verify"

interface DeployMythToken {
    log?: boolean
    updateFrontend?: boolean
}

export const deployMythToken = async ({ log = false, updateFrontend = false }: DeployMythToken) => {
    const name = "Myth Token Coin"
    const symbol = "MTC"
    const initialSupply = 1e9
    const contractName = "MythToken"

    const contractFactory = await ethers.getContractFactory(contractName)
    const mythToken = await contractFactory.deploy(name, symbol, initialSupply)

    const contractAddress = await mythToken.getAddress()

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(contractAddress, [name, symbol, initialSupply])
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

    return mythToken
}

deployMythToken({ log: true, updateFrontend: true }).catch((error) => console.log(error))
