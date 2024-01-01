"use client";

import React, { useState } from "react";

import Button from "@/app/ui/board/button";
import Form from "@/app/ui/board/form";

export default function AddList({ boardId }) {
    const [open, setOpen] = useState(false);

    return !open ? (
        <Button type="button" onClick={setOpen}>
            Add list
        </Button>
    ) : (
        <Form boardId={boardId} setOpen={setOpen} />
    );
}
