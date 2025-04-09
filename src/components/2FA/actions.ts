// "use server";

// import { ApiRequest } from "@/services/apiRequest";
// import { RequestMethodsType } from "./types";

// export async function twoFARequestHandler(
//   url: string,
//   body: object = {},
//   method: RequestMethodsType = "Get"
// ) {debugger
//   try {
//     const response = await ApiRequest(method, {}, body, url, true);
//     return response;
//   } catch (error: any) {
//     return Promise.resolve(JSON.parse(error.message));
//   }
// }
