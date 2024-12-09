import { CardsProvider } from "@/hooks/useCards";
import { MarketplaceProvider } from "@/hooks/useMarketplace";
import { UserProvider } from "@/hooks/useUser";
import { ReactNode } from "react";

interface ProviderManagerProps {
    children: ReactNode;
}

export function ProviderManager({ children }: ProviderManagerProps) {
    return (
        <UserProvider>
            <CardsProvider>
                <MarketplaceProvider>{children}</MarketplaceProvider>
            </CardsProvider>
        </UserProvider>
    );
}
