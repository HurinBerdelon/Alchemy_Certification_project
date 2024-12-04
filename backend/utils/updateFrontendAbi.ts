import { readFileSync, writeFileSync } from "fs"
import { frontendContractABILocation } from "../helper-hardhat-config"
import path from "path"

interface UpdateFrontendAbi {
    contractName: string
}

export function updateFrontendAbi({ contractName }: UpdateFrontendAbi) {
    const contractPath = path.join(
        __dirname,
        "../",
        "artifacts",
        "contracts",
        `${contractName}.sol`,
        `${contractName}.json`
    )
    const contractJson = JSON.parse(readFileSync(contractPath, "utf8"))

    const abi = contractJson.abi

    writeFileSync(`${frontendContractABILocation}/${contractName}.json`, JSON.stringify(abi))
}
