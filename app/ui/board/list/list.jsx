"use client";

import React from "react";
import Image from "next/image";

import { updateTodoStatus } from "@/app/lib/actions";

import Form from "./form";

export default function List({ lists, todos, boardId }) {
    const handleUpdateTodoStatus = async (todo) => {
        await updateTodoStatus(todo);
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

            <ul className="mt-4">
                {todos?.map(
                    (todo) =>
                        todo.list_id === list.id && (
                            <li
                                key={todo.id}
                                className={`flex items-center justify-between font-semibold p-2 shadow-lg ${
                                    todo.status ? "bg-gray-300" : "bg-green-300"
                                } rounded-md mb-2`}
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
