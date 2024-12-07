"use client";

import { BuyNewPack } from "@/components/BuyNewPack";
import { Card } from "@/components/Card";
import { CollectionNavbar } from "@/components/CollectionNavbar";
import { FundMe } from "@/components/FundMe";
import { CARD } from "@/components/RecentListed";
import { SellInput } from "@/components/SellInput";
import { useState } from "react";

const CARDS = [CARD, CARD, CARD];

export default function MyCollectionPage() {
    const [showSellButton, setShowSellButton] = useState(false);

    function toggleShowSellButton() {
        setShowSellButton((prevState) => !prevState);
    }

    return (
        <div className="px-4">
            <div className="border-t-[1px] border-zinc-900 py-2">
                <CollectionNavbar />
            </div>
            <div className="flex justify-between mb-8">
                <div className="flex flex-col gap-8">
                    <h1 className="text-2xl font-semibold">My Collection</h1>
                    <div>
                        <BuyNewPack />
                    </div>
                </div>
                <div>
                    <FundMe />
                </div>
            </div>
            <div>
                <div className="mb-2 flex gap-1 items-center">
                    <input
                        id="showSellButton"
                        type="checkbox"
                        onChange={toggleShowSellButton}
                    />
                    <label htmlFor="showSellButton">Show Sell Buttons</label>
                </div>
                <ul className="flex flex-wrap justify-center gap-8">
                    {CARDS.map((card) => (
                        <li key={card.serialNumber}>
                            {showSellButton ? (
                                <SellInput card={card} />
                            ) : (
                                <Card card={card} />
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
