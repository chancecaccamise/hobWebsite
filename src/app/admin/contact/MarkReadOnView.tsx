"use client";

import { useEffect } from "react";
import { setRead } from "./actions";

/** Marks a message as read once an admin has opened it. */
export function MarkReadOnView({ id }: { id: string }) {
  useEffect(() => {
    void setRead(id, true);
  }, [id]);
  return null;
}
