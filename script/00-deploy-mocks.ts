import { ethers } from "hardhat"

const BASE_FEE = ethers.parseEther("0.1")
const GAS_PRICE_LINK = 1e9
const WEI_PER_UNIT_LINK = process.env.WEI_PER_UNIT_LINK

export const deployMock = async (log = false) => {
    const contractName = "VRFCoordinatorV2_5Mock"
    const contractFactory = await ethers.getContractFactory(contractName)
    const vrFCoordinatorV2_5Mock = await contractFactory.deploy(
        BASE_FEE,
        GAS_PRICE_LINK,
        WEI_PER_UNIT_LINK!
    )

    const contractAddress = await vrFCoordinatorV2_5Mock.getAddress()

    if (log) {
        console.log(`===> contract ${contractName} deployed to ${contractAddress}`)
    }

    return vrFCoordinatorV2_5Mock
}

deployMock(true).catch((error) => console.log(error))
