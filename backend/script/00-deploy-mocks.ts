import { ethers } from "hardhat"

// const BASE_FEE = ethers.parseEther("0.1")
// const GAS_PRICE_LINK = 1e9
// const WEI_PER_UNIT_LINK = process.env.WEI_PER_UNIT_LINK

export const deployMock = async (log = false) => {
    // const vrfCoordinatorV2_5Mock_contractName = "VRFCoordinatorV2_5Mock"
    // const vrfCoordinatorV2_5Mock_contractFactory = await ethers.getContractFactory(
    //     vrfCoordinatorV2_5Mock_contractName
    // )
    // const vrfCoordinatorV2_5Mock = await vrfCoordinatorV2_5Mock_contractFactory.deploy(
    //     BASE_FEE,
    //     GAS_PRICE_LINK,
    //     WEI_PER_UNIT_LINK!
    // )

    // const vrfCoordinatorV2_5Mock_contractAddress = await vrfCoordinatorV2_5Mock.getAddress()

    // if (log) {
    //     console.log(
    //         `===> contract ${vrfCoordinatorV2_5Mock_contractName} deployed to ${vrfCoordinatorV2_5Mock_contractAddress}`
    //     )
    // }

    const basicNft_contractName = "BasicNft"
    const basicNft_contractFactory = await ethers.getContractFactory(basicNft_contractName)

    const basicNft = await basicNft_contractFactory.deploy()

    const basicNft_contractAddress = await basicNft.getAddress()

    if (log) {
        console.log(
            `===> contract ${basicNft_contractName} deployed to ${basicNft_contractAddress}`
        )
    }

    // return { vrfCoordinatorV2_5Mock, basicNft }
    return { basicNft }
}

deployMock(true).catch((error) => console.log(error))
