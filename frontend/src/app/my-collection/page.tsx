"use client";

import { Card } from "@/components/Card";
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
        <div>
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-semibold">My Collection</h1>
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
                <ul className="flex flex-wrap justify-start gap-8">
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
