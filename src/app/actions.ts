"use server";

import { addSubscriber } from "@/lib/subscribers";

export type SubscribeState = {
  status: "idle" | "success" | "error";
  message: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribe(
  _prev: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  // Honeypot: real users never see or fill this field.
  if (formData.get("company")) {
    return { status: "success", message: "Thanks! You're on the list." };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  try {
    const added = await addSubscriber(email);
    return {
      status: "success",
      message: added
        ? "Thanks! We'll let you know as soon as we launch."
        : "You're already on the list — we'll be in touch!",
    };
  } catch (error) {
    console.error("Failed to save subscriber", error);
    return { status: "error", message: "Something went wrong. Please try again." };
  }
}
