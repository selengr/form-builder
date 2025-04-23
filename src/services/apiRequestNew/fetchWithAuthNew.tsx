// import { authOptions } from "@/services/authBP/ssoConfiguration";
import { getServerSession } from "next-auth";
import { signIn } from "next-auth/react";
export async function FetchWithAuthNew(
  method: "Get" | "Post" | "Put" | "Patch" | "Delete" = "Get",
  url: string,
  params: any,
  hasToken: boolean,
  dataApi: object | null,
  hasClient: boolean,
  options: object
  // options: RequestInit = {},
): Promise<any> {
  try {
    let baseURL;
    if (hasClient) {
      baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    } else {
      baseURL = process.env.BASE_URL;
    }
    // let headers: { [key: string]: string } = {
    //     "Content-Type": "application/json",
    // }

    // const session = await getServerSession(authOptions);

    // if (hasToken) {
    //     headers['Authorization'] = `Bearer ${session?.access_token}`
    // }

    const urlWithParams = new URL(`${baseURL}${url}`);
    if (params) {
      Object.keys(params).forEach((key) =>
        urlWithParams.searchParams.append(key, params[key])
      );
    }
    const request = new Request(urlWithParams.toString(), {
      ...options,
      method: method.toUpperCase(), // Ensure method is uppercase
    });

    const response = await fetch(request);
    if (!response.ok) {
      const { status } = response;
      const errorText = await response.text(); // Extract error text from the response

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
      throw {
        message: errorText || errorMessage,
        status: response.status,
        statusText: response.statusText,
        extraData: response.extraData,
      };
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
