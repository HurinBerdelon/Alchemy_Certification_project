import { run } from "hardhat"

const verify = async (contractAddress: string, args: any) => {
    try {
        await run("verify:verify", {
            address: contractAddress,
            args,
        })
    } catch (error: any) {
        if (error.message.toLowerCase().includes("already verified")) {
            console.log("Already verified!")
        } else {
            console.error(error)
        }
    }
}

export default verify
