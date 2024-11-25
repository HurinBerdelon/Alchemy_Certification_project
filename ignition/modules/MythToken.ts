import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"

const MythTokenModule = buildModule("MythTokenModule", (module) => {
    const contract = module.contract("MythToken", ["Myth Token Coin", "MTC", 1e9])

    return { contract }
})

export default MythTokenModule
