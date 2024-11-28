import PinataClient from "@pinata/sdk"
import { createReadStream } from "fs"
import path from "path"

import { TokenUriMetadata } from "../types/TokenUriMetadata"
import { entities } from "./entities"

const pinataApiKey = process.env.PINATA_API_KEY!
const pinataApiSecret = process.env.PINATA_API_SECRET!
const pinataClient = new PinataClient(pinataApiKey, pinataApiSecret)

export async function storeImages(imagesFilePath: string) {
    const fullImagePath = path.resolve(imagesFilePath)

    const responses = []

    for (const entity of entities) {
        const readableStreamForFile = createReadStream(`${fullImagePath}/${entity.name}`)
        const options = {
            pinataMetadata: {
                name: entity.name,
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
