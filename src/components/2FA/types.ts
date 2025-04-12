import type { OTPResponseType } from ".";

type SendOTPUrlType = ((nationalCode: string) => string) | string;

type OTPBodyType<T> = (data: T) => object | object;

export type RequestMethodsType = "Get" | "Post" | "Put";

type IResendOtpInfo<T = {}> = Partial<T> &
  Partial<ICheckNationalCodeResponse> & {
    nationalCode?: string;
  };

type ReSendOTPUrlType<T> = ((otpInfo: T) => string) | string;

export interface TwoFABottomSheetProps<ApiResponseType = {}> {
  open: boolean;
  sendOtpInfo: {
    url: SendOTPUrlType;
    body?: OTPBodyType<string>;
    method?: RequestMethodsType;
  };
  resendOtpInfo: {
    url: ReSendOTPUrlType<IResendOtpInfo<ApiResponseType>>;
    body?: OTPBodyType<IResendOtpInfo<ApiResponseType>>;
    method?: RequestMethodsType;
  };
  otpLength?: number;
  isLoadingConfirmation?: boolean;
  onClose: () => void;
  onConfirm?: (response: OTPResponseType<ApiResponseType>) => void;
}

export interface ICheckNationalCodeResponse {
  id: string;
  username: string;
  otpEnum: string;
  message?: { title: string }[];
}
