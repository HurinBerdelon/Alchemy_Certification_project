import { existsSync, mkdirSync, writeFileSync } from "fs"
import { handleTokenUris } from "../utils/handleTokenUris"

async function uploadUriToPinata() {
    const tokenUris = await handleTokenUris()

    console.log(`Token Uris uploaded to Pinata`)

    tokenUris.forEach((tokenUri) => console.log(">>", tokenUri))

    const filePath = "./utils/tokenUris"

    if (!existsSync(filePath)) {
        mkdirSync(filePath)
    }

    writeFileSync("./utils/tokenUris/tokenUris.json", JSON.stringify(tokenUris))

    return tokenUris
}

uploadUriToPinata().catch((error) => console.log(error))
