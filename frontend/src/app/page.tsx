import { RecentListed } from "@/components/RecentListed";
import Link from "next/link";

export default function Home() {
    return (
        <>
            <section id="introduction" className="mb-4">
                <h1 className="text-2xl font-bold mb-2">
                    Welcome to Mythology Nft Collection
                </h1>
                <p>
                    {`This app was developed as the final project for Alchemy
                    Academy University Ethereum Bootcamp.
                    It is a collection of NFTs, where each NFT is a card of a character of the norse, greek or egytian mythology.
                    This app also has a marketplace where you can trade cards to fulfill your collection.`}
                </p>
                <Link href="/about" className="underline">
                    Read more
                </Link>
            </section>
            <section
                id="disclaimer"
                className="italic border-[1px] border-red-800 rounded-sm p-2 w-fit text-red-100 mb-4"
            >
                <p>{`This is a demo project deployed to a testnet and like so, user's use fake funds to interact with the project.`}</p>
                <p>{`Make sure to never connect your wallet with real funds in this projects. Real funds sent to a testnet will not be recovered.`}</p>
            </section>
            <section id="recent-listed">
                <h2 className="text-2xl font-semibold mb-2">Recent Listed</h2>
                <RecentListed />
                <div className="mt-4 flex w-full justify-center">
                    <Link
                        href="/marketplace"
                        className="py-2 px-4 bg-white text-black rounded-md hover:opacity-90"
                    >
                        See all
                    </Link>
                </div>
            </section>
        </>
    );
}
