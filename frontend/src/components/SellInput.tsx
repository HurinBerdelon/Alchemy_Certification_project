"use client";

import { CollectionCard } from "@/types/CollectionCard";
import { Card } from "./Card";
import { ChangeEvent, useState } from "react";

interface SellInputProps {
    card: CollectionCard;
}

export function SellInput({ card }: SellInputProps) {
    const [sellPrice, setSellPrice] = useState("");

    function handleChangePrice(event: ChangeEvent<HTMLInputElement>) {
        const regex = /^[0-9]*$/;

        if (regex.test(event.target.value)) {
            setSellPrice(event.target.value);
        }
    }

    return (
        <div>
            <Card card={card} />
            <div className="flex flex-col justify-between mt-4 items-center gap-2">
                <div className="flex justify-between w-full outline outline-1 -outline-offset-1 outline-zinc-800 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-800 rounded-md">
                    <input
                        name="price"
                        value={sellPrice}
                        onChange={handleChangePrice}
                        className="bg-transparent flex-1 px-2 py-1 focus:outline focus:outline-0 block"
                    />
                    <span className="border-l-[1px] px-2 py-1 border-zinc-900 bg-zinc-900">
                        MTC
                    </span>
                </div>
                <button className="px-4 w-full pt-1 rounded-md bg-red-900 text-white font-semibold">
                    Sell
                </button>
            </div>
        </div>
    );
}
