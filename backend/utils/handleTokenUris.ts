import { TokenUriMetadata } from "../types/TokenUriMetadata"
import { imagesLocation } from "./constants"
import { entities } from "./entities"
import { storeImages, storeTokenUriMetadata } from "./uploadToPinata"

export async function handleTokenUris() {
    const tokenUris = []
    const { files, results: imageUploadResponses } = await storeImages(imagesLocation)

    for (const imageResponseIndex in imageUploadResponses) {
        const metadata = entities.find((entity) => entity.name === files[imageResponseIndex])!
        const tokenUriMetada: TokenUriMetadata = {
            name: metadata.name,
            description: metadata.description,
            collectionNumber: metadata.collectionNumber,
            origin: metadata.name,
            imageUrl: `https://ipfs.io/ipfs/${imageUploadResponses[imageResponseIndex].IpfsHash}`,
        }

        const metadataUploadResponse = await storeTokenUriMetadata(tokenUriMetada)

        tokenUris.push(`https://ipfs.io/ipfs/${metadataUploadResponse?.IpfsHash}`)

        return tokenUris
    }
}
