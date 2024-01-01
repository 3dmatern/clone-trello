"use client";

import React from "react";
import Image from "next/image";

import { updateTodoListId, updateTodoStatus } from "@/app/lib/actions";

import Form from "./form";

export default function List({ lists, todos, boardId }) {
    const handleUpdateTodoStatus = async (todo) => {
        await updateTodoStatus(todo);
    };

    // drag-and-drop
    // Функция перетаскиваемого элемента
    const handleDragStart = (e) => {
        // Добавить id целевого элемента в объект передачи данных
        e.dataTransfer.setData("todoId", e.target.id);
        e.dataTransfer.effectAllowed = "move";
    };

    // Функция зоны сброса
    const handleDragOver = (e) => {
        e.preventDefault();
        // e.dataTransfer.dropEffect = "move";
    };
    // Функция сброса
    const handleDrop = async (e, boardId, listId) => {
        e.preventDefault();
        // Получить id цели и добавить перемещенный элемент в его DOM
        const todoId = e.dataTransfer.getData("todoId");
        const todo = document.getElementById(todoId);
        e.target.appendChild(todo);
        await updateTodoListId({ id: todoId, boardId, listId, status: false });
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
                onDrop={(e) => handleDrop(e, boardId, list.id)}
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
                                onDragStart={handleDragStart}
                                className={`flex items-center justify-between font-semibold p-2 shadow-lg ${
                                    todo.status ? "bg-gray-300" : "bg-green-300"
                                } rounded-md mb-2 cursor-pointer`}
                            >
                                <p>{todo.text}</p>
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleUpdateTodoStatus({
                                            ...todo,
                                            status: !todo.status,
                                        })
                                    }
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
