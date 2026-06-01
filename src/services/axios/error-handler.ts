import { AxiosError } from "axios";

export type TApiErrorResponse = {
  message?: string | { title?: string }[];
};

export const errorMessagesByStatus: Record<number, string> = {
  400: 'در اطلاعات ارسالی اشکالی وجود دارد. لطفاً موارد واردشده را بررسی و اصلاح نمایید.',
  401: 'لطفاً برای ادامه فرآیند، ابتدا وارد حساب کاربری خود شوید.',
  403: 'شما مجاز به دسترسی به این بخش نیستید.',
  404: 'مورد درخواستی یافت نشد یا ممکن است حذف شده باشد.',
  405: 'امکان انجام این نوع درخواست در حال حاضر وجود ندارد.',
  408: 'مدت زمان پاسخ‌گویی به درخواست به پایان رسیده است. لطفاً مجدداً تلاش نمایید.',
  409: 'تعارضی در اطلاعات ارسالی مشاهده شد. لطفاً اطلاعات را بازبینی نمایید.',
  422: 'محتوای ارسالی قابل پردازش نمی‌باشد. لطفاً داده‌ها را اصلاح نمایید.',
  429: 'درخواست‌های متعددی به‌صورت متوالی ارسال شده‌اند. لطفاً پس از مدتی مجدداً تلاش نمایید.',
  500: 'در اجرای درخواست خطایی در سمت سرور رخ داده است. لطفاً بعداً مجدداً تلاش نمایید.',
  502: 'در ارتباط با سرور مشکلی رخ داده است.',
  503: 'سرویس در حال حاضر در دسترس نمی‌باشد. لطفاً در زمان دیگری اقدام نمایید.',
  504: 'پاسخی از سمت سرور دریافت نشد. لطفاً وضعیت اتصال اینترنت خود را بررسی نمایید.',
};

// ------------------------------------------------------------
export function extractErrorMessage(error: AxiosError<TApiErrorResponse>): string {

  if (!error.response) {
  return 'خطا در ارتباط با سرور'; 
  }

  const data = error.response?.data;
  const status = error.response?.status;

   if (Array.isArray(data?.message)) {
     return data.message[0]?.title || 'انجام عملیات با خطا مواجه شد';
   }

    if (status && errorMessagesByStatus[status]) {
    return errorMessagesByStatus[status];
   }

  // if (typeof data?.message === 'string') {
  //   return data.message;
  // }

  return 'انجام عملیات با خطا مواجه شد';
}
// ------------------------------------------------------------
export class ApiError extends Error {

  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'خطا';
    this.status = status;
  }
}

