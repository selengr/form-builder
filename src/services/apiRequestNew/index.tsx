"use server";
// import { authOptions } from "@/services/authBP/ssoConfiguration";
import { getServerSession } from "next-auth";
import { FetchWithAuthNew } from "./fetchWithAuthNew";
import { authOptions } from "../auth/authConfig";

export async function ApiRequestNew(
  method: "Get" | "Post" | "Put" | "Patch" | "Delete" | undefined,
  params: object,
  data: object,
  url: string,
  hasToken: boolean,
  hasClient: boolean = false
): Promise<any> {
  const session = await getServerSession(authOptions);

  const headers: { [key: string]: string } = {
    "Content-Type": "application/json",
  };

  if (session && "access_token" in session) {
    headers["Authorization"] = `Bearer ${session.access_token}`;
  }
  const options: RequestInit = {
    // method: method,
    headers,
  };

  if (method !== "Get" && Object.keys(data).length > 0) {
    options.body = JSON.stringify(data);
  }
  try {
    const response = await FetchWithAuthNew(
      method,
      url,
      params,
      hasToken,
      data,
      hasClient,
      options
    );
    if (response.message) {
      throw response.message;
    }

    return response;
  } catch (error) {
    return Promise.resolve(error);
  }
}

// نحوه استفاده
// ApiRequest("Get", {}, {}, "/mhami/fp/setting/max-bank-facility", true, false).then((res) => {
// })
