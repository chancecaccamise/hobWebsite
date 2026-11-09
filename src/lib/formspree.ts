import "server-only";
import type { NewContactSubmission } from "@/lib/contact";

// Formspree emails the site owner on every submission. The endpoint isn't a
// secret (it normally sits in a public <form action>), so a default is fine;
// FORMSPREE_ENDPOINT overrides it, e.g. to point a preview deploy elsewhere.
const ENDPOINT = process.env.FORMSPREE_ENDPOINT ?? "https://formspree.io/f/mbggndqe";

export async function sendContactToFormspree(input: NewContactSubmission) {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Without this Formspree answers with an HTML redirect instead of JSON.
      Accept: "application/json",
    },
    body: JSON.stringify({
      // Formspree uses the "email" field as the reply-to address.
      name: input.name,
      email: input.email,
      phone: input.phone ?? "",
      ...(input.inquiryType && { inquiryType: input.inquiryType }),
      message: input.message,
      _subject: input.subject
        ? `House of Butts contact: ${input.subject}`
        : `New House of Butts message from ${input.name}`,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Formspree responded ${response.status}: ${detail.slice(0, 500)}`);
  }
}
