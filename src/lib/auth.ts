"use client";

import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/services/auth/authConfig";
import { AxiosApi } from "@/services/axios/AxiosApi";

let cachedUserInfo: any = null;
let cachedSession: any = null;

export async function getAccessToken(): Promise<string | null> {
  try {
    if (!cachedSession && typeof window !== "undefined") {
      cachedSession = await getSession();
    }

    if (!cachedSession && typeof window === "undefined") {
      cachedSession = await getServerSession(authOptions);
    }

    return cachedSession?.access_token ?? null;
  } catch (err) {
    console.error("❌ Error fetching session:", err);
    return null;
  }
}

export async function fetchUserInfo(): Promise<{
  userInfo: any;
  isAuthenticated: boolean;
  error: Error | null;
}> {
  try {
    const token = await getAccessToken();

    if (!token) {
      return {
        userInfo: null,
        isAuthenticated: false,
        error: null,
      };
    }

    // فقط در کلاینت کش استفاده بشه
    if (typeof window !== "undefined" && cachedUserInfo) {
      return {
        userInfo: cachedUserInfo,
        isAuthenticated: true,
        error: null,
      };
    }

    const res = await AxiosApi({
      baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      url: "/authorization/front-panel/non-org-user-role/find-user-loggedin-info",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (typeof window !== "undefined") {
      cachedUserInfo = res.data;
    }

    return {
      userInfo: res.data,
      isAuthenticated: true,
      error: null,
    };
  } catch (error) {
    console.error("❌ Error fetching user info:", error);
    return {
      userInfo: null,
      isAuthenticated: false,
      error: error as Error,
    };
  }
}
