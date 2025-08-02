import axios, { AxiosError, AxiosHeaders, AxiosRequestConfig } from "axios";
import { getSession, signIn } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/authConfig";
import { toast } from "sonner";
import { ReactNode } from "react";
import { HiMiniFingerPrint } from "react-icons/hi2";
import { FiAlertTriangle } from "react-icons/fi";
import { CgDanger } from "react-icons/cg";

enum HttpStatus {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  GONE = 410,
  LENGTH_REQUIRED = 411,
  PRECONDITION_FAILED = 412,
  PAYLOAD_TOO_LARGE = 413,
  URI_TOO_LONG = 414,
  UNSUPPORTED_MEDIA_TYPE = 415,
  RANGE_NOT_SATISFIABLE = 416,
  EXPECTATION_FAILED = 417,
  MISDIRECTED_REQUEST = 421,
  UNPROCESSABLE_ENTITY = 422,
  LOCKED = 423,
  FAILED_DEPENDENCY = 424,
  TOO_EARLY = 425,
  UPGRADE_REQUIRED = 426,
  PRECONDITION_REQUIRED = 428,
  TOO_MANY_REQUESTS = 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE = 431,
  UNAVAILABLE_FOR_LEGAL_REASONS = 451,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  HTTP_VERSION_NOT_SUPPORTED = 505,
  VARIANT_ALSO_NEGOTIATES = 506,
  INSUFFICIENT_STORAGE = 507,
  LOOP_DETECTED = 508,
  NOT_EXTENDED = 510,
  NETWORK_AUTHENTICATION_REQUIRED = 511,
}

const errorMessages: Record<HttpStatus, string> = {
  [HttpStatus.BAD_REQUEST]: "در اطلاعات ارسالی اشکالی وجود دارد. لطفاً موارد واردشده را بررسی و اصلاح نمایید.",
  [HttpStatus.UNAUTHORIZED]: "لطفاً برای ادامه فرآیند، ابتدا وارد حساب کاربری خود شوید.",
  [HttpStatus.FORBIDDEN]: "شما مجاز به دسترسی به این بخش نیستید.",
  [HttpStatus.NOT_FOUND]: "مورد درخواستی یافت نشد یا ممکن است حذف شده باشد.",
  [HttpStatus.METHOD_NOT_ALLOWED]: "امکان انجام این نوع درخواست در حال حاضر وجود ندارد.",
  [HttpStatus.NOT_ACCEPTABLE]: "پاسخ دریافتی با استانداردهای مورد انتظار مطابقت ندارد.",
  [HttpStatus.REQUEST_TIMEOUT]: "مدت زمان پاسخ‌گویی به درخواست به پایان رسیده است. لطفاً مجدداً تلاش نمایید.",
  [HttpStatus.CONFLICT]: "تعارضی در اطلاعات ارسالی مشاهده شد. لطفاً اطلاعات را بازبینی نمایید.",
  [HttpStatus.GONE]: "مورد موردنظر دیگر در دسترس نیست.",
  [HttpStatus.LENGTH_REQUIRED]: "طول محتوای ارسالی مشخص نشده است.",
  [HttpStatus.PRECONDITION_FAILED]: "برخی شرایط لازم برای انجام این عملیات فراهم نشده‌اند.",
  [HttpStatus.PAYLOAD_TOO_LARGE]: "حجم داده‌های ارسالی بیش از حد مجاز است.",
  [HttpStatus.URI_TOO_LONG]: "آدرس درخواست بیش از حد طولانی است.",
  [HttpStatus.UNSUPPORTED_MEDIA_TYPE]: "نوع داده یا فایل ارسالی پشتیبانی نمی‌شود.",
  [HttpStatus.RANGE_NOT_SATISFIABLE]: "محدوده درخواستی معتبر نمی‌باشد.",
  [HttpStatus.EXPECTATION_FAILED]: "برخی از انتظارات سرور در این درخواست برآورده نشد.",
  [HttpStatus.MISDIRECTED_REQUEST]: "درخواست به سروری نادرست هدایت شده است.",
  [HttpStatus.UNPROCESSABLE_ENTITY]: "محتوای ارسالی قابل پردازش نمی‌باشد. لطفاً داده‌ها را اصلاح نمایید.",
  [HttpStatus.LOCKED]: "امکان دسترسی به این بخش در حال حاضر غیرفعال است.",
  [HttpStatus.FAILED_DEPENDENCY]: "برخی وابستگی‌های مورد نیاز برای انجام درخواست با خطا مواجه شده‌اند.",
  [HttpStatus.TOO_EARLY]: "درخواست پیش از زمان مجاز ارسال شده است.",
  [HttpStatus.UPGRADE_REQUIRED]: "برای ادامه استفاده، لطفاً سیستم خود را به‌روزرسانی نمایید.",
  [HttpStatus.PRECONDITION_REQUIRED]: "برخی پیش‌شرط‌ها برای ادامه درخواست الزامی هستند.",
  [HttpStatus.TOO_MANY_REQUESTS]: "درخواست‌های متعددی به‌صورت متوالی ارسال شده‌اند. لطفاً پس از مدتی مجدداً تلاش نمایید.",
  [HttpStatus.REQUEST_HEADER_FIELDS_TOO_LARGE]: "حجم داده‌های ارسال‌شده در هدر درخواست بیش از حد مجاز است.",
  [HttpStatus.UNAVAILABLE_FOR_LEGAL_REASONS]: "این محتوا به دلایل حقوقی قابل ارائه نمی‌باشد.",
  [HttpStatus.INTERNAL_SERVER_ERROR]: "در اجرای درخواست خطایی در سمت سرور رخ داده است. لطفاً بعداً مجدداً تلاش نمایید.",
  [HttpStatus.NOT_IMPLEMENTED]: "امکان اجرای این درخواست در حال حاضر فراهم نیست.",
  [HttpStatus.BAD_GATEWAY]: "در ارتباط با سرور مشکلی رخ داده است.",
  [HttpStatus.SERVICE_UNAVAILABLE]: "سرویس در حال حاضر در دسترس نمی‌باشد. لطفاً در زمان دیگری اقدام نمایید.",
  [HttpStatus.GATEWAY_TIMEOUT]: "پاسخی از سمت سرور دریافت نشد. لطفاً وضعیت اتصال اینترنت خود را بررسی نمایید.",
  [HttpStatus.HTTP_VERSION_NOT_SUPPORTED]: "نسخه پروتکل مورد استفاده پشتیبانی نمی‌شود.",
  [HttpStatus.VARIANT_ALSO_NEGOTIATES]: "در هماهنگی محتوای درخواستی خطایی رخ داده است.",
  [HttpStatus.INSUFFICIENT_STORAGE]: "فضای کافی برای ذخیره اطلاعات فراهم نیست.",
  [HttpStatus.LOOP_DETECTED]: "چرخه‌ی تکرارشونده‌ای در روند اجرای درخواست شناسایی شد.",
  [HttpStatus.NOT_EXTENDED]: "پاسخ ارائه‌شده کامل نبوده و نیاز به اطلاعات بیشتری دارد.",
  [HttpStatus.NETWORK_AUTHENTICATION_REQUIRED]: "برای دسترسی به منابع شبکه، احراز هویت ضروری است.",
};

declare module 'axios' {
  export interface AxiosRequestConfig {
    _retryCount?: number;
    _shouldRetry?: boolean;
    _delay?: number;
    _enableAbortDeduplication?: boolean;
    // @ts-ignore
    signal?: AbortSignal;
  }
}

export const AxiosApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL_PSYA}/psya`,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT",
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Cross-Origin-Embedder-Policy": "require-corp",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "same-origin",
  },
  withCredentials: true,
  decompress: true,
});

async function getAccessToken(): Promise<string | null> {
  try {
    if (typeof window === "undefined") {
      const session:any = await getServerSession(authOptions);
      return session?.access_token ?? null;
    } else {
      const session:any = await getSession();
      return session?.access_token ?? null;
    }
  } catch (err) {
    console.error("❌ Error fetching session:", err);
    return null;
  }
}

const pendingRequests = new Map<string, AbortController>();

AxiosApi.interceptors.request.use(
    // @ts-ignore
    async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
      const token = await getAccessToken();

      if (token) {
        (config.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
      }

      const requestKey = `${config.method}-${config.url}`;

      if (config._enableAbortDeduplication) {
        if (pendingRequests.has(requestKey)) {
          pendingRequests.get(requestKey)?.abort();
          pendingRequests.delete(requestKey);
        }
        const controller = new AbortController();
        config.signal = controller.signal;
        pendingRequests.set(requestKey, controller);
      }

      config._retryCount = config._retryCount || 0;
      config._shouldRetry = config._shouldRetry !== false;
      config._delay = config._delay || 1000;

      return config;
    }
);

AxiosApi.interceptors.response.use(
    (response) => {
      const requestKey = `${response.config.method}-${response.config.url}`;
      pendingRequests.delete(requestKey);
      return response;
    },
    async (error: any): Promise<any> => {
      if (axios.isCancel(error)) {
        console.log('Request was cancelled', error.message);
        return Promise.reject(error);
      }

      // @ts-ignore
      const status = error.response?.status as HttpStatus | undefined;
      const msg = status && errorMessages[status]
          ? errorMessages[status]
          : "در هنگام پردازش درخواست، خطای پیش‌بینی ‌نشده‌ای رخ داده است. مجددا تلاش نمایید.";

      // @ts-ignore
      const data = error.response?.data;
      const browser = typeof window !== "undefined";
      // @ts-ignore
      const config = error.config;
      const maxRetries = 3;

      if (config && config._shouldRetry && config._retryCount! < maxRetries) {
        const retryableStatuses = [
          HttpStatus.INTERNAL_SERVER_ERROR,
          HttpStatus.BAD_GATEWAY,
          HttpStatus.SERVICE_UNAVAILABLE,
          HttpStatus.GATEWAY_TIMEOUT,
        ];

        if (!status || retryableStatuses.includes(status)) {
          config._retryCount!++;
          const delay = config._delay! * config._retryCount!;

          console.warn(`Attempting retry #${config._retryCount} for ${config.method?.toUpperCase()} ${config.url} in ${delay}ms`);

          await new Promise(resolve => setTimeout(resolve, delay));
          return AxiosApi(config);
        }
      }

      if (browser) {
        const authIcon: ReactNode = HiMiniFingerPrint({ className: "w-6 h-6" });
        const errorIcon: ReactNode = CgDanger({ className: "w-6 h-6" });
        const warnIcon: ReactNode = FiAlertTriangle({ className: "w-6 h-6" });

        if (status === HttpStatus.UNAUTHORIZED) {
          toast.error("احراز هویت انجام نشد.", {
            description: "لطفاً وارد حساب کاربری خود شوید.",
            icon: authIcon,
          });

          await signIn("authorize");
        } else if (status === HttpStatus.CONFLICT) {
          const conflictMsg = Array.isArray(data?.message) ? data?.message?.[0]?.title : data?.message;
          toast.warning("تداخل اطلاعات", {
            description: conflictMsg || msg,
            icon: warnIcon,
          });
        } else if (msg) {
          toast.error("خطا!", {
            description: msg,
            icon: errorIcon,
          });
        }
      }

      console.error("‼️API Error:", {
        // @ts-ignore
        url: error.config?.url,
        method: error.config?.method,
        status,
        data,
        code: error.code,
        message: error.message,
      });

      return Promise.reject(error);
    }
);

export const cancelRequest = (method: string, url: string) => {
  const requestKey = `${method}-${url}`;
  if (pendingRequests.has(requestKey)) {
    pendingRequests.get(requestKey)?.abort();
    pendingRequests.delete(requestKey);
    console.log(`Request ${requestKey} has been cancelled.`);
  }
};