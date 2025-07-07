import axios, {AxiosError, AxiosHeaders, InternalAxiosRequestConfig,} from "axios";
import {getSession, signIn} from "next-auth/react";
import {getServerSession} from "next-auth";
import {authOptions} from "../auth/authConfig";
import {toast} from "sonner";
import {ReactNode} from "react";
import {HiMiniFingerPrint} from "react-icons/hi2";
import {FiAlertTriangle} from "react-icons/fi";
import {CgDanger} from "react-icons/cg";

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
  [HttpStatus.BAD_REQUEST]: "درخواست شما قابل پردازش نبود.",
  [HttpStatus.UNAUTHORIZED]: "برای ادامه لازم است وارد حساب کاربری خود شوید.",
  [HttpStatus.FORBIDDEN]: "به این بخش دسترسی ندارید.",
  [HttpStatus.NOT_FOUND]: "موردی با این مشخصات پیدا نشد.",
  [HttpStatus.REQUEST_TIMEOUT]: "زمان پاسخ‌گویی به درخواست به پایان رسید.",
  [HttpStatus.CONFLICT]: "اطلاعات واردشده با هم تداخل دارند.",
  [HttpStatus.UNSUPPORTED_MEDIA]: "فرمت ارسال‌شده پشتیبانی نمی‌شود.",
  [HttpStatus.TOO_MANY_REQUESTS]: "درخواست‌های زیادی ارسال شده. لطفاً کمی بعد دوباره تلاش کنید.",
  [HttpStatus.INTERNAL_SERVER_ERROR]: "خطایی در سرور رخ داده. لطفاً بعداً دوباره تلاش کنید.",
  [HttpStatus.BAD_GATEWAY]: "ارتباط با سرور با مشکل مواجه شد.",
  [HttpStatus.SERVICE_UNAVAILABLE]: "سرویس در حال حاضر در دسترس نیست.",
  [HttpStatus.GATEWAY_TIMEOUT]: "پاسخی از سرور دریافت نشد. لطفاً بعداً دوباره تلاش کنید.",
};

export const AxiosApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL_PSYA}/psya`, timeout: 10000, headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT",
    "content-encoding": "gzip, br, deflate, zstd",
  }, withCredentials: true, decompress: true,
});

let cachedSession: any = null;

async function getAccessToken(): Promise<string | null> {
  try {
    if (!cachedSession) {
      cachedSession = typeof window === "undefined" ? await getServerSession(authOptions) : await getSession();
    }
    return cachedSession?.access_token ?? null;
  } catch (err) {
    console.error("❌ Error fetching session:", err);
    return null;
  }
}

AxiosApi.interceptors.request.use(async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
  const token = await getAccessToken();

  if (token) {
    const headers: AxiosHeaders = new AxiosHeaders(config.headers);
    headers.set("Authorization", `Bearer ${token}`);
    config.headers = headers;
  }

  return config;
});

AxiosApi.interceptors.response.use((response) => response, async (error: AxiosError): Promise<any> => {
  if (axios.isCancel(error)) return Promise.reject(error);

  // @ts-ignore
  const status = error.response?.status as HttpStatus | undefined;
  const token = await getAccessToken();

  const msg = status && errorMessages[status] ? errorMessages[status] : "خطای ناشناخته‌ای رخ داده است.";
  if (!token) {
    return Promise.reject(error);
  }
  // @ts-ignore
  const data = error.response?.data;
  const browser = typeof window !== "undefined";

  if (browser) {
    const authIcon: ReactNode = HiMiniFingerPrint({className: "w-6 h-6"});
    const errorIcon: ReactNode = CgDanger({className: "w-6 h-6"});
    const warnIcon: ReactNode = FiAlertTriangle({className: "w-6 h-6"});

    if (status === HttpStatus.UNAUTHORIZED) {
      toast.error("احراز هویت انجام نشد.", {
        description: "لطفاً وارد حساب کاربری خود شوید.", icon: authIcon,
      });
      await signIn("authorize");
    } else if (status === HttpStatus.CONFLICT) {
      const conflictMsg = Array.isArray(data?.message) ? data?.message?.[0]?.title : data?.message;
      toast.warning("تداخل اطلاعات", {
        description: conflictMsg || msg, icon: warnIcon,
      });
    } else if (msg) {
      toast.error("خطا!", {
        description: msg, icon: errorIcon,
      });
    }
  }

  console.error("🚨 API Error:", {
    // @ts-ignore
    url: error.config?.url, method: error.config?.method, status, data,
  });

  return Promise.reject(error);
});