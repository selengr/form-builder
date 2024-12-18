import axios from "axios";
import { getServerSession } from "next-auth";
import { getSession, signIn } from "next-auth/react";
import { authOptions } from "../auth/authConfig";

const AxiosApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL + "/psya",
});

let cachedSession: any = null;

AxiosApi.interceptors.request.use(async (request) => {
  try {
    if (!cachedSession) {
      if (typeof window === "undefined") {
        cachedSession = await getServerSession(authOptions);
      } else {
        cachedSession = await getSession();
      }
    }

    if (cachedSession && cachedSession.access_token) {
      request.headers["Authorization"] = `Bearer ${cachedSession.access_token}`;
    }
  } catch (error) {
    console.error("Error retrieving session:", error);
  }

  return request;
});

AxiosApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { response } = error;

    if (response && !response.ok) {
      const { status } = response;
      const errorText = (await response.data) || response.statusText;

      let errorMessage = `API request error: ${status}`;
      if (status === 401) {
        await signIn("authorize");
        errorMessage = "Authentication error occurred";
      } else if (status === 403) {
        errorMessage = "Authorization error occurred";
      } else if (status === 400) {
        errorMessage = "Bad Request";
      } else if (status === 409) {
        errorMessage = "Conflict";
      }

      console.error(errorMessage);
      throw new Error(errorText);
    }

    return Promise.reject(error);
  }
);

export default AxiosApi;
