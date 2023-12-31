import {
    fetchAllTodo,
    fetchBoardById,
    fetchListsByBoardId,
} from "@/app/lib/data";
import Link from "next/link";

import { notFound } from "next/navigation";

export const metadata = {
    title: "Board",
};

export default async function Page({ params }) {
    const id = params.id;
    const [board, lists, todos] = await Promise.all([
        fetchBoardById(id),
        fetchListsByBoardId(id),
        fetchAllTodo(),
    ]);

    if (!board) {
        notFound();
    }

    return (
        <main className="p-4">
            <Link className="block w-max" href="/">
                {"<"} Вернуться назад
            </Link>

            <h1 className="text-xl text-center p-3 bg-slate-300/50 w-3/12 rounded-md mx-auto my-5">
                {board.name}
            </h1>

            <div className="grid grid-cols-4 gap-4">
                {lists?.map((list) => (
                    <div key={list.id}>
                        <h5 className="text-md mb-8">{list.name}</h5>

                        <ul>
                            {todos?.filter(
                                (todo) =>
                                    todo.list_id === list.id && (
                                        <li key={todo.id}>{todo.text}</li>
                                    )
                            )}
                        </ul>
                    </div>
                ))}
                <div>
                    <button type="button">Add list</button>
                </div>
            </div>
        </main>
    );
}
