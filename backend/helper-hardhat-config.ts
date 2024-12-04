interface NetworkConfig {
    name: string
    ethUsdPriceFeed: string
    gaslane: string
    mintFee: string
    callbackGasLimit: string
    vrfCoordinatorV2_5Address?: string
    subscriptionId?: string
}

const networkConfig: { [key: number]: NetworkConfig } = {
    31337: {
        name: "localhost",
        ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
        gaslane: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c", // 30 gwei
        mintFee: "100", // 0.01 ETH
        callbackGasLimit: "500000", // 500,000 gas
    },
    // Price Feed Address, values can be obtained at https://docs.chain.link/data-feeds/price-feeds/addresses
    11155111: {
        name: "sepolia",
        ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
        gaslane: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c", // 30 gwei
        mintFee: "100", // 0.01 ETH
        callbackGasLimit: "500000", // 500,000 gas
        vrfCoordinatorV2_5Address: "",
        subscriptionId: "",
    },
}

const DECIMALS = "18"
const INITIAL_PRICE = "200000000000000000000" // 200e18
const developmentChains = ["hardhat", "localhost"]
const mythTokenAddress = process.env.MYTH_TOKEN_ADDRESS!

const frontendContractFile = "../frontend/src/constants/networkMapping.json"
const frontendContractABILocation = "../frontend/src/constants/Abi"

export {
    networkConfig,
    DECIMALS,
    INITIAL_PRICE,
    developmentChains,
    mythTokenAddress,
    frontendContractABILocation,
    frontendContractFile,
}
