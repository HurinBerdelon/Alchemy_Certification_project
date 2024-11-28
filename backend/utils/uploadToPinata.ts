import PinataClient from "@pinata/sdk"
import { createReadStream, readdirSync } from "fs"
import path from "path"

import { TokenUriMetadata } from "../types/TokenUriMetadata"

const pinataApiKey = process.env.PINATA_API_KEY!
const pinataApiSecret = process.env.PINATA_API_SECRET!
const pinataClient = new PinataClient(pinataApiKey, pinataApiSecret)

export async function storeImages(imagesFilePath: string) {
    const fullImagePath = path.resolve(imagesFilePath)

    const files = readdirSync(fullImagePath).filter((file) => /\b.png|\b.jpg|\b.jpeg/.test(file))

    const results = []

    for (const fileName of files) {
        const readableStreamForFile = createReadStream(`${fullImagePath}/${fileName}`)
        const options = {
            pinataMetadata: {
                name: fileName,
            },
        }

        try {
            const response = await pinataClient.pinFileToIPFS(readableStreamForFile, options)
            results.push(response)
        } catch (error) {
            console.log(error)
        }
    }
    return { results, files }
}

export async function storeTokenUriMetadata(metadata: TokenUriMetadata) {
    const options = {
        pinataMetadata: {
            name: metadata.name,
        },
    }

    try {
        const response = await pinataClient.pinJSONToIPFS(metadata, options)
        return response
    } catch (error) {
        console.log(error)
    }
    return null
}
