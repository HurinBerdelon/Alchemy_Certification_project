export function parsedAddress(address: string): string {
    const addressLength = 42;

    const firstStep = address.slice(0, 7);
    const endStep = address.slice(addressLength - 5, addressLength);

    return `${firstStep}...${endStep}`;
}
