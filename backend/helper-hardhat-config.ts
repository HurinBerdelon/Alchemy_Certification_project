interface NetworkConfig {
    name: string
    gaslane: string
    mintFee: string
    callbackGasLimit: string
    vrfCoordinatorV2_5Address?: string
    subscriptionId?: string
}

const networkConfig: { [key: number]: NetworkConfig } = {
    31337: {
        name: "localhost",
        gaslane: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c", // 30 gwei
        mintFee: "100",
        callbackGasLimit: "500000", // 500,000 gas
    },
    // Price Feed Address, values can be obtained at https://docs.chain.link/data-feeds/price-feeds/addresses
    11155111: {
        name: "sepolia",
        gaslane: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c", // 30 gwei
        mintFee: "100",
        callbackGasLimit: "500000", // 500,000 gas
        vrfCoordinatorV2_5Address: "",
        subscriptionId: "",
    },
    17000: {
        name: "holesky",
        callbackGasLimit: "500000", // 500,000 gas
        gaslane: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
        mintFee: "100",
    },
}

const developmentChains = ["hardhat", "localhost"]
const mythTokenAddress = process.env.MYTH_TOKEN_ADDRESS!

const frontendContractFile = "../frontend/src/constants/networkMapping.json"
const frontendContractABILocation = "../frontend/src/constants/Abi"

export {
    networkConfig,
    developmentChains,
    mythTokenAddress,
    frontendContractABILocation,
    frontendContractFile,
}
