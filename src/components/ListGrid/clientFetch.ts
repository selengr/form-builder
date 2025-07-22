"use client";

import {AxiosApi} from "@/services/axios/AxiosApi";

export async function clientFetch(url: string, params: Record<string, any> = {}): Promise<any | null> {
  try {
    const queryString = JSON.stringify(params);
    const encodedParams = encodeURIComponent(queryString);
    const fullURL = `${url}${encodedParams === encodeURIComponent("{}") ? "" : encodedParams}`;

    const response = await AxiosApi.get(fullURL);

    if (response?.data) {
      return response;
    }

    const status = response?.status;
    if (status === 401 || status === 403) {
      console.warn(`Access error: ${status}`);
    } else {
      console.warn("Unexpected response with no data");
    }

    return null;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}