"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import {
  deleteContactSubmission,
  markAllContactRead,
  setContactRead,
} from "@/lib/contact";

// Each lib function checks admin access itself before writing.

export async function setRead(id: string, read: boolean) {
  await setContactRead(id, read);
  refresh();
}

// From the message page: opening it marks it read again, so leave the page.
export async function markUnreadAndReturn(id: string) {
  await setContactRead(id, false);
  redirect("/admin/contact");
}

export async function markAllRead() {
  await markAllContactRead();
  refresh();
}

export async function deleteSubmission(id: string, backToList = false) {
  await deleteContactSubmission(id);
  if (backToList) redirect("/admin/contact");
  refresh();
}
