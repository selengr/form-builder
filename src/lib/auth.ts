"use client";

import {AxiosApi} from "@/services/axios/AxiosApi";
import {getAuthToken} from "@/utils/getAuthToken";

interface IFetchUserInfoResult {
  userInfo: any;
  isAuthenticated: boolean;
  error: Error | null;
}

let cachedUserInfo: any | null = null;
let cachedUserInfoPromise: Promise<IFetchUserInfoResult> | null = null;

export async function fetchUserInfo(): Promise<IFetchUserInfoResult> {
  if (typeof window !== "undefined" && cachedUserInfo) {
    return {
      userInfo: cachedUserInfo,
      isAuthenticated: true,
      error: null,
    };
  }

  if (cachedUserInfoPromise) {
    return cachedUserInfoPromise;
  }

  cachedUserInfoPromise = (async (): Promise<IFetchUserInfoResult> => {
    try {
      if (!process.env.NEXT_PUBLIC_BASE_URL) {
        throw new Error("NEXT_PUBLIC_BASE_URL is not defined");
      }

      const token = await getAuthToken();

      if (!token) {
        return {
          userInfo: null,
          isAuthenticated: false,
          error: null,
        };
      }

      const res = await AxiosApi.get<any>(
        "/authorization/front-panel/non-org-user-role/find-user-loggedin-info",
        {
          baseURL: process.env.NEXT_PUBLIC_BASE_URL,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (typeof window !== "undefined") {
        cachedUserInfo = res.data;
      }

      return {
        userInfo: res.data,
        isAuthenticated: true,
        error: null,
      };
    } catch (error: any) {
      const err = error instanceof Error ? error : new Error(error?.message || "خطای نامشخص");
      return {
        userInfo: null,
        isAuthenticated: false,
        error: err,
      };
    } finally {
      cachedUserInfoPromise = null;
    }
  })();

  return cachedUserInfoPromise;
}