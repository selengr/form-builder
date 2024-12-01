/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AxiosApi from "@/services/axios/AxiosApi";

export async function clientFetch(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  params: any = {}
): Promise<any> {
  try {
    const queryString = encodeURI(JSON.stringify(params));
    const fullURL = `${url}${queryString === "%7B%7D" ? "" : `${queryString}`}`;
    const response = await AxiosApi.get(fullURL);

    if (!response.data) {
      const { status } = response;
      if (status === 401) {
      } else if (status === 403) {
        console.log("error");
      } else {
        console.log("error");
      }
      return null;
    }

    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
