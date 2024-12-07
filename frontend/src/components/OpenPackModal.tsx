import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import ReactCardFlip from "react-card-flip";
import { Card } from "./Card";
import { CARD } from "./RecentListed";
import { useState } from "react";

interface OpenPackModalProps {
    onClose: () => void;
    isOpen: boolean;
}

export function OpenPackModal({
    isOpen,
    onClose,
}: Readonly<OpenPackModalProps>) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <DialogPanel className="space-y-8 rounded-md bg-zinc-800 p-12 shadow-md shadow-zinc-700">
                    <DialogTitle className="font-bold">
                        Open your new pack
                    </DialogTitle>
                    <ul className="flex gap-8">
                        <li>
                            <ReactCardFlip
                                isFlipped={isFlipped}
                                flipDirection="horizontal"
                            >
                                <button onClick={() => setIsFlipped(true)}>
                                    <Card card={CARD} />
                                </button>
                                <div className="bg-blue-700">
                                    <Card card={CARD} />
                                </div>
                            </ReactCardFlip>
                        </li>
                        <li>
                            <Card card={CARD} />
                        </li>
                    </ul>
                </DialogPanel>
            </div>
        </Dialog>
    );
}
