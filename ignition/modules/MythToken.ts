import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"

const MythTokenModule = buildModule("MythTokenModule", (module) => {
    const token = module.contract("MythToken", ["Myth Token Coin", "MTC"])

    return { token }
})

export default MythTokenModule
