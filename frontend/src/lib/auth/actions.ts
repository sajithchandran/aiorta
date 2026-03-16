"use server";

import { redirect } from "next/navigation";
import { clearSessionAccessToken } from "./session";

export async function logoutAction(): Promise<void> {
  await clearSessionAccessToken();
  redirect("/login");
}
