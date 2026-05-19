import { AxiosError } from "axios";

export type TApiErrorResponse = {
  message?: string | { title?: string }[];
};

export function extractErrorMessage(error: AxiosError<TApiErrorResponse>): string {
  const data = error.response?.data;

  if (Array.isArray(data?.message)) {
    return data.message[0]?.title || 'انجام عملیات با خطا مواجه شد';
  }

  if (typeof data?.message === 'string') {
    return data.message;
  }

  return 'انجام عملیات با خطا مواجه شد';
}

export class ApiError extends Error {

  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'خطا';
    this.status = status;
  }
}

