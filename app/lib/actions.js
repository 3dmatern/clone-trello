"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const FormSchemaBoard = z.object({
    id: z.string(),
    name: z.string(),
});

const CreateBoard = FormSchemaBoard.omit({ id: true });
const UpdateBoard = FormSchemaBoard.omit({ id: true });

const FormSchemaBoardList = z.object({
    id: z.string(),
    boardId: z.string(),
    name: z.string(),
    date: z.string(),
});

const CreateBoardList = FormSchemaBoardList.omit({ id: true, date: true });
const UpdateBoardList = FormSchemaBoardList.omit({ id: true, date: true });

const FormSchemaTodo = z.object({
    id: z.string(),
    boardId: z.string(),
    listId: z.string(),
    text: z.string(),
    status: z.boolean(),
    date: z.string(),
});

const CreateTodo = FormSchemaTodo.omit({
    id: true,
    date: true,
    status: true,
});
const UpdateTodo = FormSchemaTodo.omit({ id: true, date: true });

export async function createBoard(prevState, formData) {
    const validatedFields = CreateBoard.safeParse({
        name: formData.get("name"),
    });

    // Если проверка формы не удалась, верните ошибки раньше. В противном случае продолжайте.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Недостающие поля. Не удалось создать доску.",
        };
    }

    // Подготавливаем данные для вставки в базу данных
    const { name } = validatedFields.data;

    // Вставляем данные в базу данных
    try {
        await sql`
            INSERT INTO trello_boards (name)
            VALUES (${name})
        `;
    } catch (error) {
        console.error(error);
        // Если возникает ошибка базы данных, возвращаем более конкретную ошибку.
        return {
            message: "Ошибка базы данных: не удалось создать доску.",
        };
    }

    // Повторно проверить кеш страницы досок и перенаправить пользователя.
    revalidatePath("/");
    redirect("/");
}

export async function updateBoard(id, prevState, formData) {
    const validatedFields = UpdateBoard.safeParse({
        name: formData.get("name"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Недостоющие поля. Не удалось обновить доску.",
        };
    }

    const { name } = validatedFields.data;

    try {
        await sql`
            UPDATE trello_boards
            SET name = ${name}
            WHERE id = ${id}
        `;
    } catch (error) {
        return { message: "Ошибка базы данных: Не удалось обновить доску." };
    }

    revalidatePath("/");
}

export async function deleteBoard(id) {
    // выдаем новую ошибку('Не удалось удалить счет');

    try {
        await sql`DELETE FROM trello_boards WHERE id = ${id}`;
        await sql`DELETE FROM trello_board_lists WHERE board_id = ${id}`;
        revalidatePath("/");
        return { message: "Доска и связанные с ней задачи удалены" };
    } catch (error) {
        return { message: "Ошибка базы данных: Не удалось удалить доску." };
    }
}

export async function createBoardList(prevState, formData) {
    const validatedFields = CreateBoardList.safeParse({
        name: formData.get("name"),
        boardId: formData.get("boardId"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Недостоющие поля. Не удалось создать лист для задач",
        };
    }

    // Подготавливаем данные для вставки в базу данных
    const { name, boardId } = validatedFields.data;
    const date = new Date().toISOString().split("T")[0];

    if (!name) {
        return {
            errors: { name: ["Вы забыли ввести название"] },
            message: "Недостоющие поля. Не удалось создать лист для задач",
        };
    }

    try {
        await sql`
            INSERT INTO trello_board_lists (board_id, name, date)
            VALUES (${boardId}, ${name}, ${date})
        `;
    } catch (error) {
        console.error(error);
        return {
            message: "Ошибка базы данных. Не удалось создать лист для задач",
        };
    }

    revalidatePath(`/board/${boardId}`);
}

export async function createTodo(prevState, formData) {
    const validatedFields = CreateTodo.safeParse({
        text: formData.get("text"),
        boardId: formData.get("boardId"),
        listId: formData.get("listId"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Недостоющие поля. Не удалось создать задачу",
        };
    }

    const { text, boardId, listId } = validatedFields.data;
    const date = new Date().toISOString().split("T")[0];
    const status = false;

    if (!text) {
        return {
            errors: { text: ["Вы забыли ввести задачу"] },
            message: "Недостоющие поля. Не удалось создать задачу",
        };
    }

    try {
        await sql`
            INSERT INTO trello_todo (board_id, list_id, text, status, date)
            VALUES (${boardId}, ${listId}, ${text}, ${status}, ${date})
        `;
    } catch (error) {
        console.error(error);
        return {
            message: "Ошибка базы данных. Не удалось создать задачу",
        };
    }

    revalidatePath(`/board/${boardId}`);
}

export async function updateTodoStatus(payload) {
    const validatedFields = UpdateTodo.safeParse({
        text: payload.text,
        boardId: payload.board_id,
        listId: payload.list_id,
        status: payload.status,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Недостоющие поля, не удалось обновить задачу",
        };
    }

    const { status } = validatedFields.data;

    if (typeof status !== "boolean") {
        return {
            errors: { status: ["Вы не выбрали задачу"] },
            message: "Недостоющие поля. Не удалось обновить задачу",
        };
    }

    try {
        await sql`
            UPDATE trello_todo
            SET status = ${status}
            WHERE id = ${payload.id}
        `;
    } catch (error) {
        console.error(error);
        return {
            message: "Ошибка базы данных. Не удалось обновить задачу",
        };
    }
    revalidatePath(`/board/${payload.boardId}`);
}

export async function updateTodoListId(payload) {
    if (!payload) {
        return {
            errors: { status: ["Вы не выбрали лист"] },
            message: "Недостоющие поля. Не удалось обновить задачу",
        };
    }

    const { id, boardId, listId, status } = payload;

    try {
        await sql`
            UPDATE trello_todo
            SET list_id = ${listId}, status = ${status}
            WHERE id = ${id}
        `;
    } catch (error) {
        console.error(error);
        return {
            message: "Ошибка базы данных. Не удалось обновить задачу",
        };
    }
    revalidatePath(`/board/${boardId}`);
}
