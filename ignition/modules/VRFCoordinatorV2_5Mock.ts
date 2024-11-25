import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"
import { ethers } from "hardhat"

const BASE_FEE = ethers.parseEther("0.1")
const GAS_PRICE_LINK = 1e9
const WEI_PER_UNIT_LINK = process.env.WEI_PER_UNIT_LINK

const VRFCoordinatorV2_5MockModule = buildModule("VRFCoordinatorV2_5Mock", (module) => {
    const contract = module.contract("VRFCoordinatorV2_5Mock", [
        BASE_FEE,
        GAS_PRICE_LINK,
        WEI_PER_UNIT_LINK!,
    ])

    return { contract }
})

export default VRFCoordinatorV2_5MockModule
