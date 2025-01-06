import { ethers, network } from "hardhat"
import { developmentChains, initialSupply } from "../helper-hardhat-config"
import verify from "../utils/verify"

interface DeployMythToken {
    log?: boolean
}

export const deployMythToken = async ({ log = false }: DeployMythToken) => {
    const name = "Myth Token Coin"
    const symbol = "MTC"
    const _initialSupply = BigInt(initialSupply)
    const contractName = "MythToken"

    const contractFactory = await ethers.getContractFactory(contractName)
    const mythToken = await contractFactory.deploy(name, symbol, _initialSupply)

    const contractAddress = await mythToken.getAddress()

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(contractAddress, [name, symbol, _initialSupply])
    }

    if (log) {
        console.log(`===> contract ${contractName} deployed to ${contractAddress}`)
    }

    return mythToken
}

deployMythToken({ log: true }).catch((error) => console.log(error))
