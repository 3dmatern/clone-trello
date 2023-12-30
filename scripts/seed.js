import { db } from "@vercel/postgres";

async function seedTrelloBoards(client) {
    try {
        await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

        // Создаём таблицу trello_boards, если она не существует
        const createTable = await client.sql`
            CREATE TABLE IF NOT EXISTS trello_boards (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                name VARCHAR(255) NOT NULL
            );
        `;
        console.log('Создана таблица "trello_boards"');

        return createTable;
    } catch (error) {
        console.error('Ошибка создания таблицы "trello_boards":', error);
        throw error;
    }
}

async function seedTrelloBoardLists(client) {
    try {
        await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

        // Создаем таблицу trello_board_lists, если она не существует
        const createTable = await client.sql`
            CREATE TABLE IF NOT EXISTS trello_board_lists (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                board_id UUID NOT NULL,
                name VARCHAR(255) NOT NULL,
                date DATE NOT NULL
            );
        `;
        console.log('Создана таблица "trello_board_lists"');

        return createTable;
    } catch (error) {
        console.error('Ошибка создания таблицы "trello_board_lists":', error);
        throw error;
    }
}

async function seedTrelloTodo(client) {
    try {
        await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

        // Создаем таблицу trello_todo, если она не существует
        const createTable = await client.sql`
            CREATE TABLE IF NOT EXISTS trello_todo (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                list_id UUID NOT NULL,
                text VARCHAR(255) NOT NULL,
                status BOOLEAN DEFAULT false NOT NULL,
                date DATE NOT NULL
            );
        `;

        console.log('Создана таблица "trello_todo"');

        return createTable;
    } catch (error) {
        console.error('Ошибка создания таблицы "trello_todo"', error);
        throw error;
    }
}

async function main() {
    const client = await db.connect();

    await seedTrelloBoards(client);
    await seedTrelloBoardLists(client);
    await seedTrelloTodo(client);

    await client.end();
}

main().catch((err) => {
    console.error("Произошла ошибка при попытке заполнить базу данных:", err);
});
