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


export async function getAuthTokenServer(): Promise<string | null> {
  const session = await getServerSession(authOptions);

  if (!session) {
    console.warn("⚠️ Session is null in getAuthToken");
    return null;
  }

  const token = (session as any).access_token; // یا با تایپ سفارشی بهترش کن
  if (!token) {
    console.warn("⚠️ access_token not found in session");
  }

  return token ?? null;
}