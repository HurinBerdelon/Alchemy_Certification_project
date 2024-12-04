import { ethers } from "hardhat"
import { updateContractAddress } from "../utils/updateFrontendContractAddress"
import { updateFrontendAbi } from "../utils/updateFrontendAbi"

export const deployMythToken = async (log = false) => {
    const name = "Myth Token Coin"
    const symbol = "MTC"
    const initialSupply = 1e9
    const contractName = "MythToken"

    const contractFactory = await ethers.getContractFactory(contractName)
    const mythToken = await contractFactory.deploy(name, symbol, initialSupply)

    const contractAddress = await mythToken.getAddress()

    if (log) {
        console.log(`===> contract ${contractName} deployed to ${contractAddress}`)
    }

    try {
        updateContractAddress({ contractName, address: contractAddress })
        updateFrontendAbi({ contractName })
    } catch (error) {
        console.log(error)
    }

    return mythToken
}

deployMythToken(true).catch((error) => console.log(error))
