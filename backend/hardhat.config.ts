import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import dotenv from "dotenv"

dotenv.config()

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "http://eth-sepolia/example"
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0xKEY"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "0xKEY"

const config: HardhatUserConfig = {
    solidity: "0.8.27",
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
        },
        sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 11155111,
        },
    },
    gasReporter: {
        enabled: false,
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
        customChains: [],
    },
    mocha: {
        timeout: 300000, // 300 seconds
    },
    ignition: {
        // requiredConfirmations: 6,
    },
}

export default config
