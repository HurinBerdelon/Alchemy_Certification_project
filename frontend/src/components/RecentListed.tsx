import { Rarity } from "@/types/Rarity";
import { Card } from "./Card";

const CARD = {
    name: "Odin",
    description:
        "Odin is the Allfather, the chief of the Aesir gods, associated with war, wisdom, poetry, and death. He is known for sacrificing an eye to gain the knowledge of the runes.",
    origin: "norse",
    collectionNumber: "01",
    imageUri:
        "https://ipfs.io/ipfs/QmX7UXE8dSQeqyejWChS19ZzyC8sKGRxViu2tZERdoJws8",
    serialNumber: "0000000001",
    owner: "0x00000001",
    rarity: Rarity[1],
};

export function RecentListed() {
    return (
        <ul className="flex flex-wrap justify-start gap-4">
            <li>
                <Card card={CARD} />
            </li>
            <li>
                <Card card={CARD} />
            </li>
            <li>
                <Card card={CARD} />
            </li>
        </ul>
    );
}
