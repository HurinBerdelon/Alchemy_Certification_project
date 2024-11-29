"use client";

import { getRewardByFrequency } from "@/utils/getRewardByFrequency";
import { useEffect, useState } from "react";

export function WithdrawFunds() {
    const [isFundAvailable, setIsFundAvailable] = useState(true);
    const [proceeds, setProceeds] = useState(30);

    function toggleFundAvailable() {
        setIsFundAvailable((prevState) => !prevState);
    }

    return (
        <div className="flex flex-col gap-2 w-[240px]">
            <div className="flex flex-col gap-2">
                {isFundAvailable ? (
                    <p className="text-xs">
                        <span>You have accessed the app for</span>
                        <span className="px-1">{sequentialDays}</span>
                        <span>days in a roll</span>
                    </p>
                ) : null}
                {fundAvailable ? (
                    <p className="flex gap-1 text-xs">
                        <span>You have</span>
                        <span>{reward}</span>
                        <span>tokens to retrieve.</span>
                    </p>
                ) : (
                    <p className="text-xs">{`Wait ${23}h to get ${reward} tokens.`}</p>
                )}
            </div>
            {fundAvailable ? (
                <button
                    className="p-2 bg-green-800 text-white font-bold rounded-md"
                    onClick={toggleFundAvailable}
                >
                    Get Reward
                </button>
            ) : null}
        </div>
    );
}
