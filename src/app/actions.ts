"use server";

import { addContactSubmission } from "@/lib/contact";
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

export type ContactFields = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export type ContactState = {
  status: "idle" | "success" | "error";
  message: string;
  // Echoed back on errors so the form can keep what was typed.
  fields?: ContactFields;
};

// Digits plus common separators, e.g. "+1 (555) 123-4567".
const PHONE_PATTERN = /^\+?[\d\s().-]{7,25}$/;

// Expects fields named name, email, phone (optional) and message. Optional
// subject and inquiryType fields are saved too if a future form sends them.
export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  if (formData.get("company")) {
    return { status: "success", message: "Thanks for the note! We'll be in touch soon." };
  }

  const field = (name: string) => String(formData.get(name) ?? "").trim();
  const fields: ContactFields = {
    name: field("name"),
    email: field("email").toLowerCase(),
    phone: field("phone"),
    message: field("message"),
  };
  const subject = field("subject");
  const inquiryType = field("inquiryType");
  const fail = (message: string): ContactState => ({ status: "error", message, fields });

  if (!fields.name) return fail("Please tell us your name.");
  if (fields.name.length > 200) return fail("Please shorten your name.");
  if (!EMAIL_PATTERN.test(fields.email) || fields.email.length > 254) {
    return fail("Please enter a valid email address.");
  }
  if (fields.phone && !PHONE_PATTERN.test(fields.phone)) {
    return fail("Please enter a valid phone number, or leave it blank.");
  }
  if (!fields.message) return fail("Please write a message.");
  if (fields.message.length > 5000) {
    return fail("Please keep your message under 5,000 characters.");
  }
  if (subject.length > 200 || inquiryType.length > 100) {
    return fail("Something went wrong. Please try again.");
  }

  try {
    await addContactSubmission({
      name: fields.name,
      email: fields.email,
      phone: fields.phone || null,
      subject: subject || null,
      message: fields.message,
      inquiryType: inquiryType || null,
    });
    return { status: "success", message: "Thanks for the note! We'll be in touch soon." };
  } catch (error) {
    console.error("Failed to save contact submission", error);
    return fail("Something went wrong. Please try again.");
  }
}
