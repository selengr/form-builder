"use client";

import {getSession} from "next-auth/react";
import {AxiosApi} from "@/services/axios/AxiosApi";

let cachedUserInfo: any = null;
// let cachedSessionPromise: Promise<any> | null = null;
let cachedUserInfoPromise: Promise<{ userInfo: any; isAuthenticated: boolean; error: Error | null; }> | null = null;

// export async function getAccessToken(): Promise<string | null> {
//   if (cachedSessionPromise) {
//     const session = await cachedSessionPromise;
//     return session?.access_token ?? null;
//   }
//
//   cachedSessionPromise = getSession();
//   try {
//     const session = await cachedSessionPromise;
//     return session?.access_token ?? null;
//   } catch (err) {
//     console.error("❌ Error fetching session:", err);
//     return null;
//   } finally {
//     cachedSessionPromise = null;
//   }
// }

export async function fetchUserInfo(): Promise<{
  userInfo: any; isAuthenticated: boolean; error: Error | null;
}> {
  if (typeof window !== "undefined" && cachedUserInfo) {
    return {
      userInfo: cachedUserInfo, isAuthenticated: true, error: null,
    };
  }

  if (cachedUserInfoPromise) {
    return cachedUserInfoPromise;
  }

  cachedUserInfoPromise = (async () => {
    try {
      // const token = await getAccessToken();
      //
      // if (!token) {
      //   return {
      //     userInfo: null, isAuthenticated: false, error: null,
      //   };
      // }

      const res = await AxiosApi({
        baseURL: process.env.NEXT_PUBLIC_BASE_URL,
        url: "/authorization/front-panel/non-org-user-role/find-user-loggedin-info",
      });

      if (typeof window !== "undefined") {
        cachedUserInfo = res.data;
      }

      return {
        userInfo: res.data, isAuthenticated: true, error: null,
      };
    } catch (error) {
      console.error("❌ Error fetching user info:", error);
      return {
        userInfo: null, isAuthenticated: false, error: error as Error,
      };
    } finally {
      cachedUserInfoPromise = null;
    }
  })();

  return cachedUserInfoPromise;
}