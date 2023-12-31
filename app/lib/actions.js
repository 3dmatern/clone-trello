"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/dist/server/api-utils";
import { z } from "zod";

const FormSchemaBoard = z.object({
    id: z.string(),
    name: z.string({
        invalid_type_error: "Пожалуйста введите имя",
    }),
});

const CreateBoard = FormSchemaBoard.omit({ id: true, name: true });
const UpdateBoard = FormSchemaBoard.omit({ name: true, id: true });

export async function createBoard(prevState, formData) {
    const validateFields = CreateBoard.safeParse({
        name: formData.get("name"),
    });

    // Если проверка формы не удалась, верните ошибки раньше. В противном случае продолжайте.
    if (!validateFields.success) {
        return {
            errors: validateFields.error.flatten().fieldErrors,
            message: "Недостающие поля. Не удалось создать доску.",
        };
    }

    // Подготавливаем данные для вставки в базу данных
    const { name } = validateFields.data;

    // Вставляем данные в базу данных
    try {
        await sql`
            INSERT INTO trello_boards (name)
            VALUES (${name})
        `;
    } catch (error) {
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
    const validateFields = UpdateBoard.safeParse({
        name: formData.get("name"),
    });

    if (!validateFields.success) {
        return {
            errors: validateFields.error.flatten().fieldErrors,
            message: "Недостоющие поля. Не удалось обновить доску.",
        };
    }

    const { name } = validateFields.data;

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
    redirect("/");
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
