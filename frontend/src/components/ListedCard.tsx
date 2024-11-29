import { CollectionCard } from "@/types/CollectionCard";
import { Card } from "./Card";

interface ListedCardProps {
    card: CollectionCard;
}

export function ListedCard({ card }: Readonly<ListedCardProps>) {
    return (
        <div className="">
            <Card card={card} />
            <div className="flex flex-col justify-between mt-2 items-center gap-2">
                <p>
                    Price: <span className="font-bold">150 MTC</span>
                </p>
                <button className="px-4 w-full pt-1 rounded-lg bg-green-800 text-white font-semibold">
                    Buy
                </button>
            </div>
        </div>
    );
}
