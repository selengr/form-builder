import axios from "axios";
import { getServerSession } from "next-auth";
import { getSession, signIn } from "next-auth/react";
import { authOptions } from "../auth/authConfig";
import { toast } from "sonner";

const AxiosApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL_PSYA + "/psya",
});

let cachedSession: any = null;

AxiosApi.interceptors.request.use(async (request) => {
  try {
    // debugger
    if (!cachedSession) {
      if (typeof window === "undefined") {
        cachedSession = await getServerSession(authOptions);
      } else {
        cachedSession = await getSession();
      }
    }

    // if (cachedSession && cachedSession.access_token) {
      request.headers["Authorization"] = `Bearer ${cachedSession.access_token}`;
      // request.headers["Authorization"] = `Bearer eyJraWQiOiJzaGFyZS1rZXktaWQiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIwOTU1MDAwMDAwNyIsImF1ZCI6InNzb0NsaWVudC0yIiwibmJmIjoxNzQ1MDgwMDU5LCJpc3MiOiJodHRwOi8vMTcyLjE2LjExLjI0OjgwODAvc3NvIiwiaWQiOiI3IiwiZXhwIjoxNzc1MDgwMDU5LCJpYXQiOjE3NDUwODAwNTksImp0aSI6IjMxZjBkMzU4LTkwNzMtNGRlNi05ZjQ4LWY5YzIyNmNkZWZmZCJ9.d6t1H4u8s2VzzpFNS7mOJFC-njhAP70CX731oYgDo-4B3ta6sJbHmnvEXFkZ4Nz1DQwnDj6KY6cqNknMqtOmCWGUqRwVSpOwjTICKZA714IMJp8poFzzfJDPbAVhHlq0TxqywsCeKF2dmwYyG1B9yLRdG1TBg48Xb0OQBiEe96RVINkzlVtxEWaAY5bIcOpx_Y1uqsCISaqptIFC4iguXNcYBvwpbQE61KjnqbByT6eWAO4X-wgM5j327YlCR7jEH4D3tx3ZovN7CaH4Qxf2CDylMv_K3Xpm8_7tbMG93BdMWTNuc4cwCE63dUppX_mPZKzdJAOgavFBBGyTU0lwCQ`
    // }
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
        toast.error(response.data.message[0].title);
      }

      console.error(errorMessage);
      throw new Error(errorText);
    }

    return Promise.reject(error);
  }
);

export default AxiosApi;
