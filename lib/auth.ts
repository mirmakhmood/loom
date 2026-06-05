import { forbidden, redirect } from "next/navigation";
import { getSession, type SessionPayload } from "@/lib/session";

export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function requireAdmin(): Promise<SessionPayload> {
  const session = await requireAuth();

  if (session.role !== "Admin") {
    forbidden();
  }

  return session;
}
