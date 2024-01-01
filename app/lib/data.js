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

export async function fetchBoardById(id) {
    noStore();

    try {
        const data = await sql`
            SELECT * FROM trello_boards
            WHERE id = ${id}
        `;

        return data.rows[0];
    } catch (error) {
        console.error("Ошибка базы данных:", error);
        throw new Error("Не удалось получить данные о доске.");
    }
}

export async function fetchListsByBoardId(boardId) {
    noStore();

    try {
        const data = await sql`
            SELECT * FROM trello_board_lists
            WHERE board_id = ${boardId}
        `;

        return data.rows;
    } catch (error) {
        console.error("Ошибка базы данных:", error);
        throw new Error("Не удалось получить данные о списках доски.");
    }
}

export async function fetchTodoByBoardId(boardId) {
    noStore();

    try {
        const data = await sql`
        SELECT * FROM trello_todo
        WHERE board_id = ${boardId}
        `;

        return data.rows;
    } catch (error) {
        console.error("Ошибка базы данных:", error);
        throw new Error("Не удалось получить данные о задачах");
    }
}
