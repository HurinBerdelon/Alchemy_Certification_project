import Link from "next/link";

export function Footer() {
    return (
        <footer className="flex justify-between px-4 py-8 border-t-[1px] border-zinc-900">
            <div className="flex gap-2">
                <Link href="https://github.com/HurinBerdelon/Mythology_web3">
                    Project Github
                </Link>
                <Link href="https://github.com/hurinberdelon">
                    Developer Github
                </Link>
                <Link href="https://www.linkedin.com/in/fernando-henrique-p-cardozo/">
                    {" "}
                    LinkedIn
                </Link>
            </div>

            <div className="flex gap-1">
                <span>Powered by</span>
                <span className="font-medium ">HurinBerdelon</span>
            </div>
        </footer>
    );
}
