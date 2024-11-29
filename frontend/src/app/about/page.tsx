import Link from "next/link";

export default function AboutPage() {
    return (
        <div>
            <section id="introduction" className="mb-4">
                <h1 className="text-2xl font-bold mb-2">
                    Details about Mythology Nft Collection
                </h1>
                <p className="text-justify">
                    {`This app was developed as the final project for Alchemy
            Academy University Ethereum Bootcamp.
            It is a collection of NFTs, where each NFT is a card of a character of the norse, greek or egytian mythology.
            This app also has a marketplace where you can trade cards to fulfill your collection.`}
                </p>
            </section>

            <section id="instructions" className="mb-4 flex flex-col gap-2">
                <h3 className="text-xl font-semibold mb-2">Instructions</h3>
                <p>
                    <span>
                        {`To interact with this project you will need a web3 wallet, we recommend `}
                    </span>
                    <Link href="https://metamask.io/" className="underline">
                        Metamask.
                    </Link>
                    <span>
                        {` And you will also need some fake ETH, you can some from the following faucets:`}
                    </span>
                    <ul className="list-disc pl-8">
                        <li>
                            <Link
                                className="underline"
                                href="https://www.alchemy.com/faucets/ethereum-sepolia"
                            >
                                https://www.alchemy.com/faucets/ethereum-sepolia
                            </Link>
                        </li>
                        <li>
                            <Link
                                className="underline"
                                href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
                            >
                                https://cloud.google.com/application/web3/faucet/ethereum/sepolia
                            </Link>
                        </li>
                        <li>
                            <Link
                                className="underline"
                                href="https://faucet.quicknode.com/ethereum"
                            >
                                https://faucet.quicknode.com/ethereum
                            </Link>
                        </li>
                    </ul>
                    <span>{`If you are not sure on how to get the funds, check this `}</span>
                    <Link className="underline" href="#">
                        blog post
                    </Link>
                    <span>{` for a more in deep guide.`}</span>
                </p>
            </section>

            <section id="technologies" className="mb-4 flex flex-col gap-2">
                <h3 className="text-xl font-semibold mb-2">Technologies</h3>
                <p className="text-justify">
                    {`The app is a fullstack project developed with solidity and typescript. It interacts with the ethereum block chain to handle informations from the tokens, the NFTs and the NFTs buys and sells, everything is on the block chain ensuring the decentralization of data.`}
                </p>
                <p className="text-justify">
                    {`In the backend, it means, the blockchain interaction, there are 3 contracts, writeen in solidity, the language for the ethereum blockchain. One contract handles the token that works as a coin for this app, one contract to handle the NFTs and the last one takes care of the marketplace. Both the marketplace and the NFT contract interact with the token contract to handle user's payments.`}
                </p>
                <p className="text-justify">
                    {`To handle the compilation, deploys and scripts in the backend, as much as for unit testing the contract, the app uses hardhat.`}
                </p>
                <p className="text-justify">
                    {`In the frontend, the app uses NextJS written in typescript and interact with with the blockchain using ...`}
                </p>
            </section>
        </div>
    );
}
