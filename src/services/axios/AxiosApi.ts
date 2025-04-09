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
      // request.headers["Authorization"] = `Bearer ${cachedSession.access_token}`;
      request.headers["Authorization"] = `Bearer eyJraWQiOiJzaGFyZS1rZXktaWQiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIwOTU1MDAwMDAwNyIsImF1ZCI6InNzb0NsaWVudC0yIiwibmJmIjoxNzQzMTA0OTU0LCJpc3MiOiJodHRwOi8vMTcyLjE2LjExLjI0OjgwODAvc3NvIiwiaWQiOiI3IiwiZXhwIjoxNzczMTA0OTU0LCJpYXQiOjE3NDMxMDQ5NTQsImp0aSI6IjFhOGJmYWRiLTczYzgtNDVhYy1iMWJiLWE4OGRjNWQzYzMzZCJ9.I8OO4Z9Lzp_rkpZlWdyPrtrUrUuIkNBEaSQKJl2z3PXZ9mMsmpNRh5trUgr4IxT4ty8YU8T5xPyIN-mJrD9jR_W8gdFis_7lKyRxHghiTANLHTvPV1KbqcchbJlhtAJ9uBTMASqWP2D3Z8bY5UpNVzLxyF3CXUwC35CFsQXaXBxBorRtIUsy3Cph25N6ePFQb8OAnUOJ4-Yb-V-7_s-I1ZNanRgJNY-vbxL2DIRRmJeq7aUkLt-KEeWn2MA9rFl9Om8fGE1LwaWCTpIy5Jky9i9BawCfA5KT33hK7RvhU028TYs6O9rvOe5i04dQbBifEk1QUjvlPZfdoHNRandd9w`;
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
