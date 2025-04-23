export interface UserCreditListResponse {
  accountId: number;
  creditTypeValue: string;
  totalAmount: number;
  availableAmount: number;
  sum: number;
  blockAmount: string;
  creditType: string;
  creditTypeEnum: string;
  eventId: string;
  expireDate?: string | object;
  order: number;
  processUUID: string;
}

export interface SelectedCreditCardProps
  extends Pick<UserCreditListResponse, "availableAmount" | "creditTypeValue"> {
  onDelete: () => void;
  remainedCredit: number;
}

export interface ConfirmPaymentRequestBody {
  issueRequestId: number;
  otpCode: string;
  otpId: string;
  userCreditModelList: UserCreditListResponse[];
}
