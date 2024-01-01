import React from "react";
import { useFormState } from "react-dom";

import { createBoardList } from "@/app/lib/actions";

export default function Form({ boardId, setOpen }) {
    const initialState = { message: null, errors: {} };
    const [state, dispatch] = useFormState(createBoardList, initialState);

    return (
        <form
            action={dispatch}
            onSubmit={state?.message ? null : () => setOpen(false)}
            className="py-8 px-5 rounded-md bg-white text-center text-black"
        >
            <label className="block mb-4 w-full">
                <span className="block mb-3">Введите название листа</span>
                <input
                    type="text"
                    name="name"
                    className="w-full rounded-sm p-2 bg-slate-300 outline-none focus:outline-black"
                />
                {state?.errors?.name &&
                    state.errors.name.map((error) => (
                        <p key={error} className="mt-4 text-sm text-red-600">
                            {error}
                        </p>
                    ))}
            </label>
            <input name="boardId" defaultValue={boardId} hidden />

            <div className="mt-4">
                {state?.message ? (
                    <p className="text-sm text-red-600">{state.message}</p>
                ) : null}
            </div>
            <div className="flex items-center justify-between gap-4 mt-4">
                <button
                    className="p-2 bg-transparent hover:bg-red-700/75 hover:text-white transition-all duration-300"
                    type="button"
                    onClick={() => setOpen(false)}
                >
                    Отменить
                </button>
                <button
                    className="p-2 bg-green-400 hover:scale-105 transition-all duration-300"
                    type="submit"
                >
                    Создать
                </button>
            </div>
        </form>
    );
}
