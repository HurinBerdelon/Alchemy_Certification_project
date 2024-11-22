import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"

const MythTokenModule = buildModule("MythTokenModule", (module) => {
    const deployer = module.getAccount(0)
    const contract = module.contract("MythToken", ["Myth Token Coin", "MTC", 1e9], {
        from: deployer,
    })

    return { contract }
})

export default MythTokenModule
