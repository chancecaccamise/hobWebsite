import "server-only";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { toError } from "@/lib/supabase/errors";

export type ContactStatus = "all" | "unread" | "read";

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  inquiryType: string | null;
  readAt: string | null;
  createdAt: string;
};

export type NewContactSubmission = Pick<
  ContactSubmission,
  "name" | "email" | "phone" | "subject" | "message" | "inquiryType"
>;

const COLUMNS = "id, name, email, phone, subject, message, inquiry_type, read_at, created_at";
const RANGE_NOT_SATISFIABLE = "PGRST103";

type Row = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  inquiry_type: string | null;
  read_at: string | null;
  created_at: string;
};

function fromRow(row: Row): ContactSubmission {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    subject: row.subject,
    message: row.message,
    inquiryType: row.inquiry_type,
    readAt: row.read_at,
    createdAt: row.created_at,
  };
}

export async function addContactSubmission(input: NewContactSubmission) {
  const supabase = await createClient();
  const { error } = await supabase.from("contact_submissions").insert({
    name: input.name,
    email: input.email,
    phone: input.phone,
    subject: input.subject,
    message: input.message,
    inquiry_type: input.inquiryType,
  });
  if (error) throw toError(error);
}

// Reads below rely on row-level security: non-admins get no rows back.

export async function listContactSubmissions(
  status: ContactStatus,
  page: number,
  pageSize: number,
) {
  const supabase = await createClient();
  const from = (page - 1) * pageSize;

  let query = supabase
    .from("contact_submissions")
    .select(COLUMNS, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + pageSize - 1);
  if (status === "unread") query = query.is("read_at", null);
  if (status === "read") query = query.not("read_at", "is", null);

  const { data, count, error } = await query;
  if (error?.code === RANGE_NOT_SATISFIABLE) return { submissions: [], total: 0 };
  if (error) throw toError(error);

  return { submissions: (data as Row[]).map(fromRow), total: count ?? 0 };
}

export async function getContactSubmission(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_submissions")
    .select(COLUMNS)
    .eq("id", id)
    .maybeSingle();

  // A malformed id is just "not found".
  if (error?.code === "22P02") return null;
  if (error) throw toError(error);
  return data ? fromRow(data as Row) : null;
}

export async function getContactCounts(): Promise<Record<ContactStatus, number>> {
  const supabase = await createClient();
  const table = () => supabase.from("contact_submissions").select("id", { count: "exact", head: true });

  const [all, unread] = await Promise.all([table(), table().is("read_at", null)]);
  if (all.error) throw toError(all.error);
  if (unread.error) throw toError(unread.error);

  const total = all.count ?? 0;
  const unreadCount = unread.count ?? 0;
  return { all: total, unread: unreadCount, read: total - unreadCount };
}

export async function setContactRead(id: string, read: boolean) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_submissions")
    .update({ read_at: read ? new Date().toISOString() : null })
    .eq("id", id);
  if (error) throw toError(error);
}

export async function markAllContactRead() {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_submissions")
    .update({ read_at: new Date().toISOString() })
    .is("read_at", null);
  if (error) throw toError(error);
}

export async function deleteContactSubmission(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
  if (error) throw toError(error);
}
