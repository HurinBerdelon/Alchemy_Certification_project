import { run } from "hardhat"

const verify = async (contractAddress: string, args: any) => {
    console.log(`Verifying contract ${contractAddress}`)
    try {
        await run("verify:verify", {
            address: contractAddress,
            args,
        })
        console.log("--------------> Contract Verified!")
    } catch (error: any) {
        if (error.message.toLowerCase().includes("already verified")) {
            console.log("Already verified!")
        } else {
            console.error(error)
        }
    }
}

export default verify
