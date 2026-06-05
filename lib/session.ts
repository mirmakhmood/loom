import { cookies } from "next/headers";
import { SESSION_COOKIE, SESSION_MAX_AGE, type Role } from "@/lib/constants";
import {
  createSessionToken,
  parseSessionToken,
  type SessionPayload,
} from "@/lib/session-token";

export type { SessionPayload };

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE);
  return parseSessionToken(sessionCookie?.value);
}

export async function setSessionCookie(user: {
  id: number;
  username: string;
  role: Role;
}): Promise<void> {
  const cookieStore = await cookies();
  const token = await createSessionToken(user);

  cookieStore.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
