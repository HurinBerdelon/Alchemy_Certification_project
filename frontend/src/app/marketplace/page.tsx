import { ListedCard } from "@/components/ListedCard";
import { CARD } from "@/components/RecentListed";

export default function MarketplacePage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-2">Marketplace</h1>
            <p className="mb-8">
                Buy new cards and Sell the cards you do not want anymore.
            </p>
            <ul className="flex flex-wrap justify-start gap-8">
                <li>
                    <ListedCard card={CARD} />
                </li>
                <li>
                    <ListedCard card={CARD} />
                </li>
                <li>
                    <ListedCard card={CARD} />
                </li>
                <li>
                    <ListedCard card={CARD} />
                </li>
                <li>
                    <ListedCard card={CARD} />
                </li>
                <li>
                    <ListedCard card={CARD} />
                </li>
                <li>
                    <ListedCard card={CARD} />
                </li>
                <li>
                    <ListedCard card={CARD} />
                </li>
            </ul>
        </div>
    );
}
