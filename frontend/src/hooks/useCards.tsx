"use client";

import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { Contract, ethers } from "ethers";

import { packPrice } from "@/constants/packPrice";
import { Card } from "@/types/Card";
import { User } from "@/types/User";
import MythNftABI from "@/constants/Abi/MythNft.json";

interface CardsProviderProps {
    children: ReactNode;
}

interface CardsContextProps {
    cards: Card[];
    mythNftContract: Contract | undefined;
    getCardsForAddress: (address: string) => Promise<void>;
    buyPackage: (user: User) => Promise<void>;
}

const CardsContext = createContext<CardsContextProps>({} as CardsContextProps);

export function CardsProvider({ children }: Readonly<CardsProviderProps>) {
    const [cards, setCards] = useState<Card[]>([]);
    const [mythNftContract, setMythNftContract] = useState<
        Contract | undefined
    >();

    useEffect(() => {
        getProvider();
    }, []);

    async function getProvider() {
        if (window.ethereum === "undefined") {
            console.error(`window.ethereum is not defined`);
            return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);

        const signer = await provider.getSigner();

        const contract = new ethers.Contract("", MythNftABI, signer);

        setMythNftContract(contract);
    }

    async function getCardsForAddress(address: string) {
        try {
            const cardsResponse: Card[] = [];

            setCards(cardsResponse);
        } catch (error) {
            console.error(error);
        }
    }

    async function buyPackage(user: User) {
        if (user.balance! < packPrice) {
            // toast an error
        } else {
            try {
                //TODO: buy package twice
                await mythNftContract!.requestNft(
                    0,
                    Math.random(),
                    Math.random()
                );

                await getCardsForAddress(user.address);
            } catch (error) {
                console.error(error);
            }
        }
    }

    return (
        <CardsContext.Provider
            value={{ cards, mythNftContract, getCardsForAddress, buyPackage }}
        >
            {children}
        </CardsContext.Provider>
    );
}

export function useCards() {
    return useContext(CardsContext);
}
