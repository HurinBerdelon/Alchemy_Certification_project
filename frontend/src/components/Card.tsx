import { TOTAL_COLLECTION } from "@/constants/totalCollection";
import { CollectionCard } from "@/types/CollectionCard";
import Image from "next/image";
import Link from "next/link";

interface CardProps {
    card: CollectionCard;
}

export function Card({ card }: Readonly<CardProps>) {
    return (
        <div className="w-[315px] h-[480px] border-4 rounded-md">
            <div className="flex flex-col items-center px-2 py-px rounded-md h-full">
                <div className="w-full flex justify-between items-center">
                    <h2 className="text-left text-2xl font-semibold capitalize">
                        {card.name}
                    </h2>
                    <Link
                        href={`/collection/${card.owner}`}
                        className="italic text-sm"
                    >
                        {card.owner}
                    </Link>
                </div>
                <div className="w-full">
                    <Image
                        className="object-cover border-4 border-[#D4AF37] w-full flex-1"
                        src={card.imageUri}
                        alt={card.name}
                        width={150}
                        height={38}
                    />
                </div>
                <h3 className="capitalize font-medium text-lg">
                    {card.origin}
                </h3>
                <p className="italic flex-1 font-light text-sm text-justify">
                    {card.description}
                </p>
                <div className="w-full font-medium flex items-end justify-between">
                    <span className="text-xs italic font-light">
                        {card.serialNumber}
                    </span>
                    <div className="text-right">
                        <span>{card.collectionNumber}</span>
                        <span>{"/"}</span>
                        <span>{TOTAL_COLLECTION}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
