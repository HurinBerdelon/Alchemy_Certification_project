"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export function CollectionNavbar() {
    const pathName = usePathname();
    const { address } = useParams();
    return (
        <nav className="flex gap-2">
            <Link
                href={address ? `/collection/${address}` : "/my-collection"}
                className={`${
                    pathName === "/my-collection" ||
                    pathName == `/collection/${address}`
                        ? "underline"
                        : ""
                } hover:opacity-90`}
            >
                Collection
            </Link>
            <Link
                href={
                    address
                        ? `/collection/${address}/list`
                        : "/my-collection/list"
                }
                className={`${
                    pathName.includes("/list") ? "underline" : ""
                } hover:opacity-90`}
            >
                List of Cards
            </Link>
        </nav>
    );
}
