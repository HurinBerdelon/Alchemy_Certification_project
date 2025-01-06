import { TokenUriMetadata } from "../types/TokenUriMetadata"
import { imagesLocation } from "./constants"
import { entities } from "./entities"
import { storeImages, storeTokenUriMetadata } from "./uploadToPinata"

export async function handleTokenUris() {
    const tokenUris: string[] = []
    const imageUploadResponses = await storeImages(imagesLocation)

    for (const entityIndex in entities) {
        const metadata = entities.find((entity) => entity.name === entities[entityIndex].name)!
        const tokenUriMetada: TokenUriMetadata = {
            name: metadata.name,
            description: metadata.description,
            collectionNumber: Number(entityIndex) + 1,
            origin: metadata.origin,
            imageUrl: `https://ipfs.io/ipfs/${imageUploadResponses[entityIndex].IpfsHash}`,
        }

        const metadataUploadResponse = await storeTokenUriMetadata(tokenUriMetada)

        tokenUris.push(`https://ipfs.io/ipfs/${metadataUploadResponse?.IpfsHash}`)
    }
    return tokenUris
}
