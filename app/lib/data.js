import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";

export async function fetchBoards() {
    // Добавьте сюда noStore(), чтобы предотвратить кэширование ответа.
    // Это эквивалентно in fetch(..., {cache: 'no-store'}).
    noStore();

    try {
        const data = await sql`SELECT * FROM trello_boards`;
        return data.rows;
    } catch (error) {
        console.error("Ошибка базы данных:", error);
        throw new Error("Не удалось получить данные о досках.");
    }
}
