import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
    return (
        <nav className="flex justify-between items-center p-4">
            <Link href="/">
                <Image src="./logo.svg" alt="To do" width={150} height={70} />
            </Link>

            <h1 className="text-center text-2xl">Clone Trello</h1>

            <button className="rounded-md bg-slate-300/75 hover:bg-slate-300 p-1 text-2xl size-10">
                +
            </button>
        </nav>
    );
}
