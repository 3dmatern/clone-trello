"use client";

import React, { useState } from "react";
import Image from "next/image";

import { updateTodoListId, updateTodoStatus } from "@/app/lib/actions";

import Form from "./form";

export default function List({ lists, todos, boardId }) {
    const [draggedItem, setDraggedItem] = useState(null);

    const handleUpdateTodoStatus = async (payload) => {
        await updateTodoStatus(payload);
    };

    // drag-and-drop
    // Функция перетаскиваемого элемента
    const handleDragStart = (e, item) => {
        setDraggedItem(item);
        e.dataTransfer.effectAllowed = "move";
        // Добавляем данные в объект события для использования в touchend
        e.dataTransfer.setData("text/plain", item);
    };
    // Функция перетаскивания для сенсорных устройств
    const handleTouchStart = (e, item) => {
        setDraggedItem(item);

        // Сохраняем координаты касания
        e.dataTransfer.setData(
            "touchCoords",
            JSON.stringify({ x: e.touches[0].clientX, y: e.touches[0].clientY })
        );
    };

    // Функция зоны сброса
    const handleDragOver = (e) => {
        e.preventDefault();
    };
    // Функция сброса
    const handleDrop = (e, listId) => {
        e.preventDefault();

        updateTodoListId({
            id: draggedItem.id,
            boardId: draggedItem.board_id,
            listId,
            status: false,
        });
        setDraggedItem(null);
    };
    // Функция сброса для сенсорных устройств
    const handleTouchEnd = (e, listId) => {
        e.preventDefault();

        // Получаем координаты касания
        const touchCoords = JSON.parse(e.dataTransfer.getData("touchCoords"));

        // Проверяем, что перемещение было достаточным для считывания как перетаскивание
        if (
            Math.abs(e.changedTouches[0].clientX - touchCoords.x) > 10 ||
            Math.abs(e.changedTouches[0].clientY - touchCoords.y) > 10
        ) {
            updateTodoListId({
                id: draggedItem.id,
                boardId: draggedItem.board_id,
                listId,
                status: false,
            });
        }
        setDraggedItem(null);
    };

    return lists?.map((list) => (
        <div
            key={list.id}
            className="py-8 px-5 rounded-md bg-white text-center text-black"
        >
            <h5 className="text-md mb-2">{list.name}</h5>
            <hr />

            <Form boardId={boardId} listId={list.id} />
            <hr />

            <ul
                id={list.id}
                onDrop={(e) => handleDrop(e, list.id)}
                onTouchEnd={(e) => handleTouchEnd(e, list.id)}
                onDragOver={handleDragOver}
                className="mt-4 w-full h-full"
            >
                {todos?.map(
                    (todo) =>
                        todo.list_id === list.id && (
                            <li
                                key={todo.id}
                                id={todo.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, todo)}
                                onTouchStart={(e) => handleTouchStart(e, todo)}
                                className={`flex items-center justify-between font-semibold p-2 shadow-lg ${
                                    todo.status ? "bg-gray-300" : "bg-green-300"
                                } rounded-md mb-2 cursor-pointer`}
                            >
                                <p className="w-11/12">{todo.text}</p>
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleUpdateTodoStatus({
                                            id: todo.id,
                                            boardId: todo.board_id,
                                            status: !todo.status,
                                        })
                                    }
                                    onTouchEnd={() =>
                                        handleUpdateTodoStatus({
                                            id: todo.id,
                                            boardId: todo.board_id,
                                            status: !todo.status,
                                        })
                                    }
                                    className="size-6"
                                >
                                    {todo.status ? (
                                        <Image
                                            src="/doneAll.svg"
                                            alt="done-all"
                                            width={24}
                                            height={24}
                                        />
                                    ) : (
                                        <Image
                                            src="/done.svg"
                                            alt="done"
                                            width={24}
                                            height={24}
                                        />
                                    )}
                                </button>
                            </li>
                        )
                )}
            </ul>
        </div>
    ));
}
