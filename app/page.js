import Link from "next/link";

import { fetchBoards } from "./lib/data";

import Navbar from "./ui/board/navbar";

export default async function Home() {
    const boards = await fetchBoards();

    return (
        <>
            <Navbar />

            <main>
                <div className="grid lg:grid-cols-4 gap-4 md:grid-cols-2">
                    {boards?.map((board) => (
                        <Link
                            className="text-center rounded-md shadow-md p-4 mt-10 bg-slate-300/50"
                            key={board.id}
                            href={`/board/${board.id}`}
                        >
                            {board.name}
                        </Link>
                    ))}
                </div>
            </main>
        </>
    );
}
