import Link from "next/link";
import Image from "next/image";

import CreateBoard from "./createBoard";

export default function Navbar() {
    return (
        <nav className="flex justify-between items-center p-4">
            <Link href="/">
                <Image
                    src="/logo.svg"
                    alt="To do"
                    width={96}
                    height={40}
                    className="md:w-40 md:h-16"
                />
            </Link>

            <h1 className="text-center text-2xl">Drag and Drop</h1>

            <CreateBoard />
        </nav>
    );
}
