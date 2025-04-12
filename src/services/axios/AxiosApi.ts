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
    if (!cachedSession) {
      if (typeof window === "undefined") {
        cachedSession = await getServerSession(authOptions);
      } else {
        cachedSession = await getSession();
      }
    }

    if (cachedSession && cachedSession.access_token) {
      request.headers["Authorization"] = `Bearer ${cachedSession.access_token}`;
      // request.headers["Authorization"] = `Bearer eyJraWQiOiJzaGFyZS1rZXktaWQiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIwOTU1MDAwMDAwNyIsImF1ZCI6InNzb0NsaWVudC0yIiwibmJmIjoxNzQ0MDYwNDI2LCJpc3MiOiJodHRwOi8vMTcyLjE2LjExLjI0OjgwODAvc3NvIiwiaWQiOiI3IiwiZXhwIjoxNzc0MDYwNDI2LCJpYXQiOjE3NDQwNjA0MjYsImp0aSI6IjFjMTY4ZmYwLTA5YjQtNGEzYy1hMDRiLWM1Y2EyNWNlNzAzNyJ9.laT7pUnDdkQFhDbza5Y8w_herhkDDfn2OAGMMiSqt53qNE_UGTQSEa-VfgCkqVRroYplIZjbNsoFxhNq1qslJGpmyFcKfhs0QSuig7ol7-jssaFRRStSl2V8Vch51ocflt8QM25Aid84hbH3YzoPECzSfanxLuo3IyEGkH9baQttjS7jQ8BY6E9J4qmMWzzxQkzUpOSmpJMNatY73tipsSLvZ6TDuHEvM2VXYXGyKKccQ199y-r4wLVVLaYA4ZlW5nOKSxTmCxdW8TcB1h1LnrwYenBywGx3Dp9LNC3_pz1g8JVdOvRqmf0wkPzloXZuZZwTDVXoZag3rMVPrQCHDA`
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
        toast.error(response.data.message[0].title);
      }

      console.error(errorMessage);
      throw new Error(errorText);
    }

    return Promise.reject(error);
  }
);

export default AxiosApi;
