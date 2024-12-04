// import Image from "next/image";

export function Header() {
    return (
        <header className="flex justify-between p-4 items-center">
            {/* <Image /> */}
            <h4 className="text-2xl font-semibold">Mythology Nft Colletion</h4>

            <div className="flex gap-4 items-center">
                <div className="flex gap-1">
                    <span className="italic">Tokens:</span>
                    <span className="font-semibold">50</span>
                </div>
                <button className="p-4 bg-white rounded-md text-black font-semibold">
                    Connect Wallet
                </button>
            </div>
        </header>
    );
}
