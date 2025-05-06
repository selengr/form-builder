import axios, {AxiosError, AxiosHeaders, InternalAxiosRequestConfig} from "axios";
import {getSession, signIn} from "next-auth/react";
import {getServerSession} from "next-auth";
import {authOptions} from "../auth/authConfig";
import {toast} from "sonner";

enum HttpStatus {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  UNSUPPORTED_MEDIA = 415,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

const errorMessages: Record<HttpStatus, string> = {
  [HttpStatus.BAD_REQUEST]: "درخواست نامعتبر بود.",
  [HttpStatus.UNAUTHORIZED]: "احراز هویت انجام نشد.",
  [HttpStatus.FORBIDDEN]: "شما مجوز لازم را ندارید.",
  [HttpStatus.NOT_FOUND]: "موردی یافت نشد.",
  [HttpStatus.REQUEST_TIMEOUT]: "درخواست بیش از حد طول کشید.",
  [HttpStatus.CONFLICT]: "تعارض در اطلاعات ارسالی.",
  [HttpStatus.UNSUPPORTED_MEDIA]: "فرمت داده پشتیبانی نمی‌شود.",
  [HttpStatus.TOO_MANY_REQUESTS]: "تعداد درخواست بیش از حد مجاز است.",
  [HttpStatus.INTERNAL_SERVER_ERROR]: "خطای داخلی سرور.",
  [HttpStatus.BAD_GATEWAY]: "درگاه ارتباطی خراب است.",
  [HttpStatus.SERVICE_UNAVAILABLE]: "سرویس موقتاً غیرفعال است.",
  [HttpStatus.GATEWAY_TIMEOUT]: "پاسخی از سرور دریافت نشد.",
};

export const AxiosApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL_PSYA}/psya`,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT",
    "content-encoding": "gzip, br, deflate, zstd",
  },
  withCredentials: true,
  decompress: true,
});

let cachedSession: any = null;

async function getAccessToken(): Promise<string | null> {
  try {
    if (!cachedSession) {
      cachedSession = typeof window === "undefined"
        ? await getServerSession(authOptions)
        : await getSession();
    }
    return cachedSession?.access_token ?? null;
  } catch (err) {
    console.error("❌ Error fetching session:", err);
    return null;
  }
}

AxiosApi.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    const token = await getAccessToken();

    if (!token) {
      throw new axios.Cancel("⛔ کاربر لاگین نیست. درخواست API لغو شد.");
    }

    const headers: AxiosHeaders = new AxiosHeaders(config.headers);
    headers.set("Authorization", `Bearer ${token}`);
    config.headers = headers;

    return config;
  }
);

AxiosApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError): Promise<any> => {
    if (axios.isCancel(error)) return Promise.reject(error);
    // @ts-ignore
    const status: HttpStatus | undefined = error.response?.status;
    const msg = status ? errorMessages[status] || "خطای ناشناخته‌ای رخ داده است." : "خطا در ارتباط با سرور";

    const token = await getAccessToken();

    if (token) {
      if (status === HttpStatus.UNAUTHORIZED) {
        toast.error("لطفاً دوباره وارد شوید.");
        await signIn("authorize");
      } else {
        toast.error(msg);
      }
    }

    console.error("🚨 API Error:", {
      // @ts-ignore
      url: error.config?.url, method: error.config?.method, status, data: error.response?.data,
    });

    return Promise.reject(error);
  }
);


export default AxiosApi;
