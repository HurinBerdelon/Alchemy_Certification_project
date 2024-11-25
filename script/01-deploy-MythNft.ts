import { ethers, ignition, network } from "hardhat"
import VRFCoordinatorV2_5MockModule from "../ignition/modules/VRFCoordinatorV2_5Mock"
import { developmentChains, mythTokenAddress, networkConfig } from "../helper-hardhat-config"
import MythNftModule from "../ignition/modules/MythNft"
import { Contract } from "ethers"
import verify from "../utils/verify"

const FUND_AMOUNT = ethers.parseEther("1000")

interface DeployMythNftParams {
    tokenUris?: string[]
    _mythTokenAddress?: string
}

export const deployMythNft = async ({
    tokenUris = new Array(34),
    _mythTokenAddress = mythTokenAddress,
}: DeployMythNftParams) => {
    const chainId = network.config.chainId ?? 31337

    const gaslane = networkConfig[chainId].gaslane
    const callbackGasLimit = networkConfig[chainId].callbackGasLimit
    const mintFee = networkConfig[chainId].mintFee

    let vrfCoordinatorV2_5Address: string
    let subscriptionId: string
    let vrfCoordinatorV2_5Mock: { contract: Contract } | undefined = undefined

    if (chainId === 31337) {
        vrfCoordinatorV2_5Mock = await ignition.deploy(VRFCoordinatorV2_5MockModule)
        vrfCoordinatorV2_5Address = await vrfCoordinatorV2_5Mock.contract.getAddress()
        const transactionResponse = await vrfCoordinatorV2_5Mock.contract.createSubscription()
        const transactionReceipt = await transactionResponse.wait(1)

        subscriptionId = transactionReceipt.logs[0].args[0]

        await vrfCoordinatorV2_5Mock.contract.fundSubscription(subscriptionId, FUND_AMOUNT)
    } else {
        vrfCoordinatorV2_5Address = networkConfig[chainId].vrfCoordinatorV2_5Address as string
        subscriptionId = networkConfig[chainId].subscriptionId as string
    }

    const vrfClientAddress = vrfCoordinatorV2_5Address

    const args = [
        vrfClientAddress,
        subscriptionId,
        gaslane,
        callbackGasLimit,
        tokenUris,
        mintFee,
        _mythTokenAddress,
    ]

    const mythNft = await ignition.deploy(MythNftModule, {
        parameters: {
            MythNftModule: {
                subscriptionId,
                vrfClientAddress: vrfCoordinatorV2_5Address,
                mythTokenAddress: _mythTokenAddress,
            },
        },
    })

    const mythNftAddress = await mythNft.contract.getAddress()

    if (chainId === 31337 && vrfCoordinatorV2_5Mock !== undefined) {
        await vrfCoordinatorV2_5Mock.contract.addConsumer(subscriptionId, mythNftAddress)
    }

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(mythNftAddress, args)
    }
}

deployMythNft({}).catch((error) => console.log(error))
