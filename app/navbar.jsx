import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="flex justify-between items-center p-4">
            <Link href="/">
                <Image src="./logo.svg" alt="To do" width={150} height={70} />
            </Link>

            <h1 className="text-center text-2xl">Clone Trello</h1>

            <button className="rounded-md bg-slate-300 p-1">Добавить</button>
        </nav>
    );
}
