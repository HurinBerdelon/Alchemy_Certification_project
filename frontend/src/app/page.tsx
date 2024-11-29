import Image from "next/image";

const CARD = {
    name: "Odin",
    description:
        "Odin is the Allfather, the chief of the Aesir gods, associated with war, wisdom, poetry, and death. He is known for sacrificing an eye to gain the knowledge of the runes.",
    origin: "norse",
    collectionNumber: "01",
    imageUrl:
        "https://ipfs.io/ipfs/QmX7UXE8dSQeqyejWChS19ZzyC8sKGRxViu2tZERdoJws8",
};

const TOTAL_COLLECTION = 34;
const SERIAL_NUMBER = "0000000001";

export default function Home() {
    return (
        <div className="w-[315px] h-[440px] border-4 rounded-md m-auto mt-12">
            <main className="flex flex-col items-center px-2 py-px rounded-md h-full ">
                <h2 className="w-full text-left text-2xl font-semibold capitalize">
                    {CARD.name}
                </h2>
                {/* <div className="border-2 object-cover w-full flex-1"> */}
                <Image
                    className="object-cover border-4 border-[#D4AF37] w-full flex-1"
                    src={CARD.imageUrl}
                    alt={CARD.name}
                    width={315}
                    height={38}
                />
                {/* </div> */}
                <h3 className="capitalize font-medium text-lg">
                    {CARD.origin}
                </h3>
                <p className="italic font-light text-sm">{CARD.description}</p>
                <div className="w-full font-medium flex items-end justify-between">
                    <span className="text-xs italic font-light">
                        {SERIAL_NUMBER}
                    </span>
                    <div className="text-right">
                        <span>{CARD.collectionNumber}</span>
                        <span>{"/"}</span>
                        <span>{TOTAL_COLLECTION}</span>
                    </div>
                </div>
            </main>
        </div>
    );
}
