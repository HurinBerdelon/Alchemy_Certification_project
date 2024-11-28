import { ethers, network } from "hardhat"
import { ContractTransactionReceipt, ContractTransactionResponse } from "ethers"

import { VRFCoordinatorV2_5Mock } from "../typechain-types"
import verify from "../utils/verify"
import { developmentChains, mythTokenAddress, networkConfig } from "../helper-hardhat-config"
import { deployMock } from "./00-deploy-mocks"
import { handleTokenUris } from "../utils/handleTokenUris"

const FUND_AMOUNT = ethers.parseEther("1000")

interface DeployMythNftParams {
    tokenUris?: string[]
    _mythTokenAddress?: string
    maxNumberOfCollection?: number
    log?: boolean
}

export const deployMythNft = async ({
    tokenUris = new Array(34).fill(""),
    _mythTokenAddress = mythTokenAddress,
    maxNumberOfCollection = 34,
    log = false,
}: DeployMythNftParams) => {
    const contractName = "MythNft"

    const chainId = network.config.chainId ?? 31337
    const gaslane = networkConfig[chainId].gaslane
    const callbackGasLimit = networkConfig[chainId].callbackGasLimit
    const mintFee = networkConfig[chainId].mintFee

    let vrfCoordinatorV2_5Address: string
    let subscriptionId: string
    let vrfCoordinatorV2_5Mock:
        | (VRFCoordinatorV2_5Mock & {
              deploymentTransaction(): ContractTransactionResponse
          })
        | undefined

    if (process.env.UPLOAD_TO_PINATA === "true") {
        tokenUris = await handleTokenUris()
    }

    if (chainId === 31337) {
        const contracts = await deployMock()
        vrfCoordinatorV2_5Mock = contracts.vrfCoordinatorV2_5Mock
        vrfCoordinatorV2_5Address = await vrfCoordinatorV2_5Mock.getAddress()
        const transactionResponse = await vrfCoordinatorV2_5Mock.createSubscription()
        const transactionReceipt = (await transactionResponse.wait(1)) as ContractTransactionReceipt

        // @ts-ignore
        subscriptionId = transactionReceipt.logs[0].args[0]

        await vrfCoordinatorV2_5Mock.fundSubscription(subscriptionId, FUND_AMOUNT)
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
        maxNumberOfCollection,
        tokenUris,
        mintFee,
        _mythTokenAddress,
    ]

    const contractFactory = await ethers.getContractFactory(contractName)
    const mythNft = await contractFactory.deploy(
        vrfClientAddress,
        subscriptionId,
        gaslane,
        callbackGasLimit,
        maxNumberOfCollection,
        tokenUris,
        mintFee,
        _mythTokenAddress
    )

    const mythNftAddress = await mythNft.getAddress()

    if (chainId === 31337 && vrfCoordinatorV2_5Mock !== undefined) {
        await vrfCoordinatorV2_5Mock.addConsumer(subscriptionId, mythNftAddress)
        const transactionResponse = await vrfCoordinatorV2_5Mock.createSubscription()
        await transactionResponse.wait(1)
    }

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(mythNftAddress, args)
    }

    const contractAddress = await mythNft.getAddress()

    if (log) {
        console.log(`===> contract ${contractName} deployed to ${contractAddress}`)
    }

    return { mythNft, vrfCoordinatorV2_5Mock }
}

deployMythNft({ log: true }).catch((error) => console.log(error))
