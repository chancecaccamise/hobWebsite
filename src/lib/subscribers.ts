import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

// Local JSON storage so signups work out of the box with `npm run dev`.
// Swap this for an email provider (Mailchimp, ConvertKit, Klaviyo, etc.) or a
// database before deploying — serverless hosts don't keep files written at runtime.
const DATA_FILE = path.join(process.cwd(), "data", "subscribers.json");

type Subscriber = { email: string; subscribedAt: string };

async function readSubscribers(): Promise<Subscriber[]> {
  try {
    return JSON.parse(await readFile(DATA_FILE, "utf8"));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

/** Returns false if the email was already subscribed. */
export async function addSubscriber(email: string): Promise<boolean> {
  const subscribers = await readSubscribers();
  if (subscribers.some((s) => s.email === email)) return false;

  subscribers.push({ email, subscribedAt: new Date().toISOString() });
  await mkdir(path.dirname(DATA_FILE), { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(subscribers, null, 2));
  return true;
}
