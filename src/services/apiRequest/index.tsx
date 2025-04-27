"use server";
import { requestAPi } from "@/services/apiRequest/fetchWithAuth";
// import { authOptions } from "@/services/authBP/ssoConfiguration";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/authConfig";

export async function ApiRequest(
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
  const response = await requestAPi(
    method,
    url,
    params,
    hasToken,
    data,
    hasClient,
    options
  );

  return response;
}

// نحوه استفاده
// ApiRequest("Get", {}, {}, "/mhami/fp/setting/max-bank-facility", true, false).then((res) => {
// })
