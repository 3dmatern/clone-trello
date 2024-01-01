import Link from "next/link";
import { notFound } from "next/navigation";

import {
    fetchBoardById,
    fetchListsByBoardId,
    fetchTodoByBoardId,
} from "@/app/lib/data";
import AddList from "./addList";
import List from "@/app/ui/board/list/list";

export const metadata = {
    title: "Board",
};

export default async function Page({ params }) {
    const id = params.id;
    const [board, lists, todos] = await Promise.all([
        fetchBoardById(id),
        fetchListsByBoardId(id),
        fetchTodoByBoardId(id),
    ]);
    console.log(lists);

    if (!board) {
        notFound();
    }

    return (
        <main className="p-4">
            <Link href="/" className="block w-max">
                {"<"} Go back
            </Link>

            <h1 className="text-xl text-center p-3 bg-slate-300/50 lg:w-3/12 md:w-max rounded-md mx-auto my-5">
                {board.name}
            </h1>

            <div className="grid lg:grid-cols-4 gap-4 md:grid-cols-2">
                <List lists={lists} todos={todos} boardId={id} />
                <div>
                    <AddList boardId={id} />
                </div>
            </div>
        </main>
    );
}
