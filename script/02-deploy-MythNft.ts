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
    maxNumberOfCollection?: number
}

export const deployMythNft = async ({
    tokenUris = new Array(34).fill(""),
    _mythTokenAddress = mythTokenAddress,
    maxNumberOfCollection = 34,
}: DeployMythNftParams) => {
    const chainId = network.config.chainId ?? 31337

    const contract = await ethers.getContractFactory("MythNft")

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

    const mythNft = await ignition.deploy(MythNftModule, {
        parameters: {
            MythNftModule: {
                subscriptionId,
                tokenUris,
                vrfClientAddress: vrfCoordinatorV2_5Address,
                mythTokenAddress: _mythTokenAddress,
                maxNumberOfCollection,
            },
        },
    })

    const mythNftAddress = await mythNft.contract.getAddress()

    if (chainId === 31337 && vrfCoordinatorV2_5Mock !== undefined) {
        await vrfCoordinatorV2_5Mock.contract.addConsumer(subscriptionId, mythNftAddress)
        const transactionResponse = await vrfCoordinatorV2_5Mock.contract.createSubscription()
        await transactionResponse.wait(1)
    }

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        const args = [
            vrfClientAddress,
            subscriptionId,
            gaslane,
            callbackGasLimit,
            maxNumberOfCollection,
            tokenUris,
            mintFee,
            _mythTokenAddress,
        ]

        await verify(mythNftAddress, args)
    }

    return { contract: mythNft.contract }
}

deployMythNft({}).catch((error) => console.log(error))
