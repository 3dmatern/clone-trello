"use server";

export function createBoard(name) {
    localStorage.setItem(name);
}
