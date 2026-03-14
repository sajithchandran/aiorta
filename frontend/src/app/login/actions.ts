"use server";

import { redirect } from "next/navigation";
import { clearSessionAccessToken, setSessionAccessToken } from "@/lib/auth/session";

const DEFAULT_API_BASE_URL = "http://localhost:4000";
const API_PREFIX = "/api/v1";

function normalizeApiBaseUrl(rawBaseUrl: string): string {
  const trimmedBaseUrl = rawBaseUrl.replace(/\/+$/, "");

  if (trimmedBaseUrl.endsWith(API_PREFIX)) {
    return trimmedBaseUrl;
  }

  return `${trimmedBaseUrl}${API_PREFIX}`;
}

const API_BASE_URL = normalizeApiBaseUrl(
  process.env.AIORTA_API_BASE_URL ?? DEFAULT_API_BASE_URL
);

export async function loginAction(
  _previousState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return {
      error: "Email and password are required."
    };
  }

  const authResponse = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    }),
    cache: "no-store"
  });

  if (!authResponse.ok) {
    await clearSessionAccessToken();
    return {
      error: authResponse.status === 401 ? "Invalid email or password." : "Unable to sign in right now."
    };
  }

  const authPayload = (await authResponse.json()) as {
    accessToken: string;
    expiresIn?: string;
  };

  const tenantsResponse = await fetch(`${API_BASE_URL}/tenants`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${authPayload.accessToken}`
    },
    cache: "no-store"
  });

  if (!tenantsResponse.ok) {
    await clearSessionAccessToken();
    return {
      error: "Authentication succeeded, but no tenant context could be loaded."
    };
  }

  const tenants = (await tenantsResponse.json()) as Array<{ slug: string }>;

  if (tenants.length === 0) {
    await clearSessionAccessToken();
    return {
      error: "This account does not belong to any tenant yet."
    };
  }

  await setSessionAccessToken(authPayload.accessToken);
  redirect(`/t/${tenants[0].slug}/dashboard`);
}
