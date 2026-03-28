import { AxiosApi } from '@/services/axios/AxiosApi';
import { ConfirmPaymentRequestBody } from '../types';
// actions
import { serviceCostAction } from '../../../../../../actions/cart/serviceCost';
import { issueRequestAction } from '../../../../../../actions/cart/issueRequest';
import { userCreditListAction } from '../../../../../../actions/cart/userCreditList';
import { twoFARequestHandlerAction } from '../../../../../../actions/cart/twofa';
import { confirmPaymentAction } from '../../../../../../actions/cart/confirmPayment';

export async function serviceCost() {
  return serviceCostAction();
}

export const issueRequest = async () => {
  return issueRequestAction();
};

export const userCreditList = async (issueRequestId: number) => {
  return userCreditListAction(issueRequestId);
};

// export const confirmPayment = async (body: ConfirmPaymentRequestBody) => {
//   return confirmPaymentAction(body);
// }

export async function confirmPayment(body: ConfirmPaymentRequestBody) {
  try {
    const userCreditModelList = body.userCreditModelList.map((item) => ({
      accountId: item.accountId,
      creditType: item.creditType,
      creditTypeEnum: item.creditTypeEnum,
      totalAmount: item.totalAmount,
      availableAmount: item.availableAmount,
      order: item.order,
    }));
    const temp = {
      issueRequestId: +body.issueRequestId,
      otpCode: body.otpCode,
      otpId: body.otpId,
      userCreditModelList,
    };
    const response = await AxiosApi.post('/purchase-order/updateAndDeliveryIssueRequest', temp);
    return response;
  } catch (error: any) {
    return Promise.resolve(JSON.parse(error.message));
  }
}

export async function connectToGateway(redirectUrl: string, amount: number) {
  try {
    const baseUrl = '/mhesam/profile/credit/before-gateway';
    const response = await AxiosApi.post(
      baseUrl,
      { redirectUrl, amount, failedRedirectUrl: window.location.href.replace('/gateway', '/failed') },
      {
        baseURL: process.env.NEXT_PUBLIC_BASE_URL_PSYA,
      },
    );
    return response.data;
  } catch (error: any) {
    return Promise.resolve(JSON.parse(error.message));
  }
}

export async function twoFARequestHandler(nationalCode: string) {
  return twoFARequestHandlerAction(nationalCode);
}
