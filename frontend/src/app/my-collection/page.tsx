import { FundMe } from "@/components/FundMe";

export default function MyCollectionPage() {
    return (
        <main>
            <div className="flex p-4 justify-between">
                <h1 className="text-2xl font-semibold">My Collection</h1>
                <div>
                    <FundMe />
                </div>
            </div>
        </main>
    );
}
