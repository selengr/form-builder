import axios from "axios";

const AxiosApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/psya",
});

// AxiosApi.interceptors.request.use(async (request) => {
//   try {
//     let session;

//     if (typeof window === "undefined") {
//       session = await getServerSession(authOptions);
//     } else {
//       session = await getSession();
//     }

//     if (session && session.access_token) {
//       request.headers["Authorization"] = `Bearer ${session.access_token}`;
//     }
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
