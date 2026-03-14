import "server-only";

import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = "aiorta_access_token";

type SessionCookieOptions = {
  maxAge?: number;
};

export async function getSessionAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
}

export async function setSessionAccessToken(
  accessToken: string,
  options: SessionCookieOptions = {}
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: options.maxAge ?? 60 * 60 * 8
  });
}

export async function clearSessionAccessToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
