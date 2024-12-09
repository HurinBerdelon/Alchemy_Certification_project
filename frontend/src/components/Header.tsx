"use client";

// import Image from "next/image";

import { useUser } from "@/hooks/useUser";

export function Header() {
    const { user, authUser } = useUser();
    return (
        <header className="flex justify-between p-4 items-center">
            {/* <Image /> */}
            <h4 className="text-2xl font-semibold">Mythology Nft Colletion</h4>

            {user.address ? (
                <div className="flex gap-2 items-center p-4 bg-zinc-800 rounded-md">
                    <span className="border-r border-zinc-400 pr-2">
                        {user.UIAddress}
                    </span>
                    <div className="flex gap-1">
                        <span className="font-semibold">50</span>
                        <span className="italic">MTC</span>
                    </div>
                </div>
            ) : (
                <button
                    onClick={authUser}
                    className="p-4 bg-white rounded-md text-black font-semibold"
                >
                    Connect Wallet
                </button>
            )}
        </header>
    );
}
