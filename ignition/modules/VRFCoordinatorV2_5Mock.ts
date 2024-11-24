import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"
import { ethers } from "hardhat"

const BASE_FEE = ethers.parseEther("0.25")
const GAS_PRICE_LINK = 1e9

const VRFCoordinatorV2_5MockModule = buildModule("VRFCoordinatorV2_5Mock", (module) => {
    const deployer = module.getAccount(0)
    const contract = module.contract("VRFCoordinatorV2_5Mock", [BASE_FEE, GAS_PRICE_LINK], {
        from: deployer,
    })

    return { contract }
})

export default VRFCoordinatorV2_5MockModule
