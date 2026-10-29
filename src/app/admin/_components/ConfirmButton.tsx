"use client";

import type { ComponentProps } from "react";

/** A submit button that asks before letting its form submit. */
export function ConfirmButton({
  confirmMessage,
  ...props
}: ComponentProps<"button"> & { confirmMessage: string }) {
  return (
    <button
      type="submit"
      {...props}
      onClick={(event) => {
        if (!window.confirm(confirmMessage)) event.preventDefault();
      }}
    />
  );
}
