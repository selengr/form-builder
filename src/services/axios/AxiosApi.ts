/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
// import { signIn } from "next-auth/react";
// import { getServerSession } from "next-auth";
// import { getSession } from "next-auth/react";
// import { authOptions } from "../auth/authConfig";

const AxiosApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// AxiosApi.interceptors.request.use(async (request) => {
//   try {
//     // let session: any;
//     // if (typeof window === "undefined") {
//     //   session = await getServerSession(authOptions);
//     // } else {
//     //   session = await getSession();
//     // }
//     // if (session && session.access_token) {
//     // }
//   } catch (error) {
//     console.error("Error retrieving session:", error);
//   }

//   return request;
// });

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
        // await signIn("authorize");
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
