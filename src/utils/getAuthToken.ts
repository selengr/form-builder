import {getServerSession} from "next-auth";
import {getSession} from "next-auth/react";
import {authOptions} from "@/services/auth/authConfig";

let cachedSession: any = null;

export async function getAuthToken(): Promise<string | null> {
  try {
    if (!cachedSession) {
      cachedSession =
        typeof window === "undefined"
          ? await getServerSession(authOptions)
          : await getSession();
    }
    return cachedSession?.access_token ?? null;
  } catch (err) {
    console.error("❌ Error fetching session:", err);
    return null;
  }
}