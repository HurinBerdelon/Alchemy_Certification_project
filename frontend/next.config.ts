import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            { hostname: "lh5.googleusercontent.com" },
            { hostname: "ipfs.io" },
        ],
    },
};

export default nextConfig;
