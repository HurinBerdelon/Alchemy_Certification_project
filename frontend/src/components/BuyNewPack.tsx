import { packPrice } from "@/constants/packPrice";
import { useState } from "react";
import { OpenPackModal } from "./OpenPackModal";

export function BuyNewPack() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    function toggleModal() {
        setIsModalOpen((prevState) => !prevState);
    }

    async function hangleBuyPack() {
        // TODO
        toggleModal();
    }

    return (
        <div>
            <OpenPackModal isOpen={isModalOpen} onClose={toggleModal} />
            <button
                className="p-2 bg-green-800 text-white font-bold rounded-md"
                onClick={hangleBuyPack}
            >
                <span>{`Buy Pack `}</span>
                <span>{`(${packPrice} MTC)`}</span>
            </button>
        </div>
    );
}
