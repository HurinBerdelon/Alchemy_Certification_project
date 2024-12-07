import { Card } from "@/components/Card";
import { CardBack } from "@/components/CardBack";
import { CollectionNavbar } from "@/components/CollectionNavbar";
import { CARD } from "@/components/RecentListed";
import { fullCollectionCards } from "@/constants/entities";

const CARDS = [CARD, CARD, CARD];

interface CollectionPageProps {
    params: Promise<{
        address: string;
    }>;
}

export default async function CollectionPage({
    params,
}: Readonly<CollectionPageProps>) {
    const { address } = await params;

    return (
        <div className="px-4">
            <div className="border-t-[1px] border-zinc-900 py-2">
                <CollectionNavbar />
            </div>
            <div className="flex justify-between mb-8">
                <h1 className="text-2xl font-semibold">
                    Collection from {address}
                </h1>
            </div>
            <div>
                <ul className="flex flex-wrap justify-center gap-8">
                    {fullCollectionCards.map((card) => (
                        <li key={card.name}>
                            {CARDS.map((ownedCard) => ownedCard.name).includes(
                                card.name
                            ) ? (
                                <Card card={CARDS[0]} />
                            ) : (
                                <CardBack name={card.name} />
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
