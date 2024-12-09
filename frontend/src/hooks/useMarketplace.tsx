import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

import { Card } from "@/types/Card";

interface MarketplaceProviderProps {
    children: ReactNode;
}

interface MarketplaceContextProps {
    listedCards: Card[];
    listCard: (tokenId: string, price: number) => Promise<void>;
    updateListedCard: (tokenId: string, newPrice: number) => Promise<void>;
    buyCard: (tokenId: string, value: number) => Promise<void>;
    cancelListing: (tokenId: string) => Promise<void>;
}

const MarketplaceContext = createContext<MarketplaceContextProps>(
    {} as MarketplaceContextProps
);

export function MarketplaceProvider({ children }: MarketplaceProviderProps) {
    const [listedCards, setListedCards] = useState<Card[]>([]);

    useEffect(() => {
        getListedCards();
    }, []);

    async function getListedCards() {
        // TODO: call getListed Cards
        const listedCardsResponse: Card[] = [];

        setListedCards(listedCardsResponse);
    }

    async function listCard(tokenId: string, price: number) {
        // TODO: List card

        await getListedCards();
    }

    async function updateListedCard(tokenId: string, newPrice: number) {
        // TODO: Update listed card

        await getListedCards();
    }

    async function buyCard(tokenId: string, value: number) {
        // TODO: Buy the card

        await getListedCards();
    }

    async function cancelListing(tokenId: string) {
        // TODO: Cancel Listing

        await getListedCards();
    }

    return (
        <MarketplaceContext.Provider
            value={{
                listedCards,
                buyCard,
                cancelListing,
                listCard,
                updateListedCard,
            }}
        >
            {children}
        </MarketplaceContext.Provider>
    );
}

export function useMarketplace() {
    return useContext(MarketplaceContext);
}
