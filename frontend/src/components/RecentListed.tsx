import { Rarity } from "@/types/Rarity";
import { ListedCard } from "./ListedCard";

export const CARD = {
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
        <ul className="flex flex-wrap justify-center gap-8">
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
    );
}
