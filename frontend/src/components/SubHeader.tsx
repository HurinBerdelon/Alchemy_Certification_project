"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SubHeader() {
    const pathName = usePathname();
    return (
        <nav className="flex gap-2 px-4 py-2 border-t-[1px] border-zinc-900">
            <Link
                href="/"
                className={`${
                    pathName === "/" ? "underline" : ""
                } hover:opacity-90`}
            >
                Home
            </Link>
            <Link
                href="/marketplace"
                className={`${
                    pathName === "/marketplace" ? "underline" : ""
                } hover:opacity-90`}
            >
                Marketplace
            </Link>
            <Link
                href="/my-collection"
                className={`${
                    pathName === "/my-collection" ? "underline" : ""
                } hover:opacity-90`}
            >
                My Colletion
            </Link>
            <Link
                href="/about"
                className={`${
                    pathName === "/about" ? "underline" : ""
                } hover:opacity-90`}
            >
                About
            </Link>
        </nav>
    );
}
