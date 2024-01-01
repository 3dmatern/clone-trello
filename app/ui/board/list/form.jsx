import { useFormState } from "react-dom";

import { createTodo } from "@/app/lib/actions";

export default function Form({ boardId, listId }) {
    const initialState = { message: null, errors: {} };
    const [state, dispatch] = useFormState(createTodo, initialState);

    return (
        <form action={dispatch} className="my-3">
            <div className="relative">
                <input
                    type="text"
                    name="text"
                    placeholder="Введите задачу"
                    className="w-full rounded-sm p-1 px-2 pr-7 shadow-md bg-slate-300/50 outline-none hover:outline-gray-400"
                />
                <button
                    type="submit"
                    className={`
                        absolute inset-y-0 right-1 z-10 size-5 
                        flex items-center justify-center rounded-md mt-2 
                        text-white bg-green-500 active:scale-95 transition-all
                    `}
                >
                    +
                </button>
            </div>
            <input type="text" name="boardId" defaultValue={boardId} hidden />
            <input type="text" name="listId" defaultValue={listId} hidden />

            {state?.errors?.text &&
                state.errors.text.map((error) => (
                    <p key={error} className="mt-2 text-red-600">
                        {error}
                    </p>
                ))}

            {state?.message ? (
                <p className="mt-2 text-sm text-red-600">{state.message}</p>
            ) : null}
        </form>
    );
}
