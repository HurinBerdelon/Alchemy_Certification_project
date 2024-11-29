import PinataClient from "@pinata/sdk"
import { createReadStream } from "fs"
import path from "path"

import { TokenUriMetadata } from "../types/TokenUriMetadata"
import { entities } from "./entities"

const pinataApiKey = process.env.PINATA_API_KEY!
const pinataApiSecret = process.env.PINATA_API_SECRET!
const pinataClient = new PinataClient(pinataApiKey, pinataApiSecret)

export async function storeImages(imagesFilePath: string) {
    console.log("Running storeImages to Pinata...")
    const fullImagePath = path.resolve(imagesFilePath)

    const responses = []

    for (const entity of entities) {
        const readableStreamForFile = createReadStream(`${fullImagePath}/${entity.name}.png`)
        const options = {
            pinataMetadata: {
                name: `${entity.name} image`,
            },
        }

        try {
            const response = await pinataClient.pinFileToIPFS(readableStreamForFile, options)
            responses.push(response)
        } catch (error) {
            console.log(error)
        }
    }
    return responses
}

export async function storeTokenUriMetadata(metadata: TokenUriMetadata) {
    console.log(`Running storeMetadata (${metadata.name}) to Pinata...`)
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
