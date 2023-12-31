"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { createBoard } from "@/app/lib/actions";

export default function CreateBoard() {
    const initialState = { message: null, errors: {} };
    const [state, dispatch] = useFormState(createBoard, initialState);

    const [open, setOpen] = useState(false);
    // const [nameBoard, setNameBoard] = useState("");

    // const handleChange = ({ target }) => {
    //     if (target.value !== "") {
    //         setError(false);
    //     }
    //     setNameBoard(target.value);
    // };

    // const handleSubmit = (e) => {
    //     e.preventDefault();

    //     if (nameBoard === "") {
    //         setError(true);
    //         return;
    //     }

    //     setNameBoard("");
    //     setOpen(false);
    // };

    return (
        <>
            <div className="flex items-center justify-center size-12">
                <button
                    className="m-auto rounded-md bg-slate-300/75 p-1 text-2xl size-10 hover:bg-slate-300 active:size-12 transition-all"
                    onClick={setOpen}
                >
                    +
                </button>
            </div>

            {open && (
                <div className="fixed inset-0 z-10 w-screen h-screen flex items-center justify-center bg-slate-300/50">
                    <form
                        action={dispatch}
                        className="py-20 px-20 rounded-lg text-center bg-gradient-to-r to-emerald-500 to-90% via-sky-500 via-30% from-indigo-500 from-10%"
                    >
                        <label>
                            <h5 className="text-2xl mb-8">
                                Как назовем доску?
                            </h5>
                            <input
                                className={`block m-auto rounded-sm p-2 text-fuchsia-500 ${
                                    state?.errors?.name && "outline-red-600"
                                } outline-none focus:outline-fuchsia-500 shadow-2xl`}
                                type="text"
                                name="name"
                                // value={nameBoard}
                                // onChange={handleChange}
                            />
                            {state?.errors?.name &&
                                state.errors.name.map((error) => (
                                    <p className="mt-4" key={error}>
                                        {error}
                                    </p>
                                ))}
                        </label>

                        <div className="mt-4">
                            {state?.message ? (
                                <p className=" text-sm text-red-500">
                                    {state.message}
                                </p>
                            ) : null}
                        </div>

                        <div className="flex items-center justify-between gap-4 mt-8">
                            <button
                                className="bg-transparent p-2 hover:bg-red-700/75 transition-all duration-300"
                                type="button"
                                onClick={() => setOpen(false)}
                            >
                                Отменить
                            </button>
                            <button
                                className="bg-slate-300/50 p-2 hover:bg-slate-300/75 hover:scale-110 transition-all duration-300"
                                type="submit"
                                // onClick={handleSubmit}
                            >
                                Создать
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}
