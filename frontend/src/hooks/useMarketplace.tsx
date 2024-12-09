"use client";

import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

import { Card } from "@/types/Card";
import { ethers } from "ethers";
import { Contract } from "ethers";
import MythMarketplaceAbi from "@/constants/Abi/MythNftMarketplace.json";

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
    const [mythMarketplaceContract, setMythMarketplaceContract] =
        useState<Contract>();

    useEffect(() => {
        getListedCards();
        getProvider();
    }, []);

    async function getProvider() {
        if (window.ethereum === "undefined") {
            console.error(`window.ethereum is not defined`);
            return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);

        const signer = await provider.getSigner();

        const contract = new ethers.Contract("", MythMarketplaceAbi, signer);

        setMythMarketplaceContract(contract);
    }

    async function getListedCards() {
        try {
            // TODO: call getListed Cards
            const listedCardsResponse: Card[] = [];

            setListedCards(listedCardsResponse);
        } catch (error) {
            console.error(error);
        }
    }

    async function listCard(tokenId: string, price: number) {
        try {
            // TODO: List card
            await mythMarketplaceContract!.listItem("", tokenId, price);

            await getListedCards();
        } catch (error) {
            console.error(error);
        }
    }

    async function updateListedCard(tokenId: string, newPrice: number) {
        try {
            // TODO: Update listed card
            await mythMarketplaceContract!.updateListing("", tokenId, newPrice);
            await getListedCards();
        } catch (error) {
            console.error(error);
        }
    }

    async function buyCard(tokenId: string) {
        try {
            // TODO: Buy the card
            await mythMarketplaceContract!.buyItem("", tokenId);
            await getListedCards();
        } catch (error) {
            console.error(error);
        }
    }

    async function cancelListing(tokenId: string) {
        try {
            // TODO: Cancel Listing
            await mythMarketplaceContract!.cancelListing("", tokenId);

            await getListedCards();
        } catch (error) {
            console.error(error);
        }
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
