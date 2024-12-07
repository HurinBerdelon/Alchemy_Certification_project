import { User } from "@/types/User";
import { createContext, ReactNode, useContext, useState } from "react";

interface UserProviderProps {
    children: ReactNode;
}

interface UserContextProps {
    user: User;
    authUser: () => Promise<void>;
    fundUser: (value: number) => Promise<void>;
}

const UserContext = createContext<UserContextProps>({} as UserContextProps);

export function UserProvider({ children }: Readonly<UserProviderProps>) {
    const [user, setUser] = useState<User>({
        address: "",
        balance: 0,
        lastFund: 0,
        sequentialFunds: 0,
    });

    async function authUser() {
        const user: User = {
            address: "",
            balance: 0,
            lastFund: 0,
            sequentialFunds: 0,
        };
        setUser(user);
    }

    async function fundUser(value: number) {
        // TODO: fundUser

        await getUserBalance();
    }

    async function getUserBalance() {
        // TODO: getBalance
        // TODO: getFrequency

        const balance = 0;
        const lastFund = 0;
        const sequentialFunds = 0;

        setUser((prevState) => ({
            ...prevState,
            balance: balance,
            lastFund,
            sequentialFunds,
        }));
    }

    return (
        <UserContext.Provider value={{ authUser, fundUser, user }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
