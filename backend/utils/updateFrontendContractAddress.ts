import { readFileSync, writeFileSync } from "fs"
import { network } from "hardhat"
import { frontendContractFile } from "../helper-hardhat-config"

interface UpdateContractAddressProps {
    contractName: string
    address: string
}

export async function updateContractAddress({ address, contractName }: UpdateContractAddressProps) {
    const chainId = network.config.chainId!
    const contractAddresses = JSON.parse(readFileSync(frontendContractFile, "utf-8"))
    if (chainId in contractAddresses) {
        if (!contractAddresses[chainId][contractName].includes(address)) {
            contractAddresses[chainId][contractName].push(address)
        }
    } else {
        contractAddresses[chainId] = { [contractName]: [address] }
    }
    writeFileSync(frontendContractFile, JSON.stringify(contractAddresses))
}
