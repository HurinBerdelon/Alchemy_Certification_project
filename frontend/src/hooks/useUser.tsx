"use client";

import { createContext, ReactNode, useContext, useState } from "react";

import { User } from "@/types/User";
import { ethers, Contract } from "ethers";
import MythTokenABI from "@/constants/Abi/MythToken.json";
import { parsedAddress } from "@/utils/parsedAddress";

interface UserProviderProps {
    children: ReactNode;
}

interface UserContextProps {
    user: User;
    mythTokenContract: Contract | undefined;
    authUser: () => Promise<void>;
    fundUser: (value: number) => Promise<void>;
}

const UserContext = createContext<UserContextProps>({} as UserContextProps);

export function UserProvider({ children }: Readonly<UserProviderProps>) {
    const [mythTokenContract, setMythTokenContract] = useState<
        Contract | undefined
    >();
    const [user, setUser] = useState<User>({
        address: "",
        UIAddress: "",
        balance: 0,
        lastFund: 0,
        sequentialFunds: 0,
    });

    async function authUser() {
        if (window.ethereum === "undefined") {
            console.error(`window.ethereum is not defined`);
            return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);

        const signer = await provider.getSigner();

        const contract = new ethers.Contract("", MythTokenABI, signer);

        setMythTokenContract(contract);

        const user: User = {
            address: signer.address,
            UIAddress: parsedAddress(signer.address),
            balance: 0,
            lastFund: 0,
            sequentialFunds: 0,
        };
        setUser(user);

        getUserBalance();
    }

    async function fundUser(value: number) {
        try {
            // TODO: fundUser
            await mythTokenContract!.fundMe(value);

            await getUserBalance();
        } catch (error) {
            console.error(error);
        }
    }

    async function getUserBalance() {
        try {
            // TODO: getFrequency
            const userBalance = await mythTokenContract!.balanceOf(
                user.address
            );
            const userFrequency = await mythTokenContract!.getFrequency();

            const sequentialFunds = Number(userFrequency[0]);
            const lastFund = Number(userFrequency[1]);

            setUser((prevState) => ({
                ...prevState,
                balance: Number(userBalance),
                lastFund,
                sequentialFunds,
            }));
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <UserContext.Provider
            value={{ mythTokenContract, user, authUser, fundUser }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
