import { createContext, ReactNode, useContext, useState } from "react";

import { packPrice } from "@/constants/packPrice";
import { Card } from "@/types/Card";
import { User } from "@/types/User";

interface CardsProviderProps {
    children: ReactNode;
}

interface CardsContextProps {
    cards: Card[];
    getCardsForAddress: (address: string) => Promise<void>;
    buyPackage: (user: User) => Promise<void>;
}

const CardsContext = createContext<CardsContextProps>({} as CardsContextProps);

export function CardsProvider({ children }: Readonly<CardsProviderProps>) {
    const [cards, setCards] = useState<Card[]>([]);

    async function getCardsForAddress(address: string) {
        const cardsResponse: Card[] = [];

        setCards(cardsResponse);
    }

    async function buyPackage(user: User) {
        if (user.balance! < packPrice) {
            // toast an error
        } else {
            //TODO: buy package twice
        }

        await getCardsForAddress(user.address);
    }

    return (
        <CardsContext.Provider
            value={{ cards, getCardsForAddress, buyPackage }}
        >
            {children}
        </CardsContext.Provider>
    );
}

export function useCards() {
    return useContext(CardsContext);
}
