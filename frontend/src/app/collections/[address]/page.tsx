import { Card } from "@/components/Card";
import { CARD } from "@/components/RecentListed";

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

    console.log({ params });
    return (
        <div>
            <div className="flex justify-between mb-8">
                <h1 className="text-2xl font-semibold">
                    Collection from {address}
                </h1>
            </div>
            <div>
                <ul className="flex flex-wrap justify-start gap-8">
                    {CARDS.map((card) => (
                        <li key={card.serialNumber}>
                            <Card card={card} />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
