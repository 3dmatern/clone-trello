import Navbar from "./components/navbar";
import { fetchBoards } from "./lib/data";

export default async function Home() {
    const boards = await fetchBoards();

    return (
        <main className="xl:container m-auto">
            <Navbar />

            <div className="grid grid-cols-4 gap-4">
                {boards?.map((board) => (
                    <div
                        className="rounded-md shadow-md p-4 mt-10 bg-slate-300/50"
                        key={board.id}
                    >
                        {board.name}
                    </div>
                ))}
            </div>
        </main>
    );
}
