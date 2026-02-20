import { AxiosApi } from '@/services/axios/AxiosApi';
import { ConfirmPaymentRequestBody } from '../types';
// actions
import { serviceCostAction } from '../../../../../../actions/cart/serviceCost';
import { issueRequestAction } from '../../../../../../actions/cart/issueRequest';

export async function serviceCost() {
  return serviceCostAction();
}

export const issueRequest = async () => {
  return issueRequestAction();
};

export const userCreditList = async (issueRequestId: number) => {
  try {
    const body = {
      issueRequestId,
    };
    const response = await AxiosApi.post('/mhesam/profile/credit/user-credit-list', body, {
      baseURL: process.env.NEXT_PUBLIC_BASE_URL_PSYA,
    });
    return response.data;
  } catch (error) {
    return Promise.resolve('');
  }
};

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
  try {
    const response = await AxiosApi.post(`/check-nationalCode-send-code`, { nationalCode });
    return response.data;
  } catch (error: any) {
    return Promise.resolve(JSON.parse(error.message));
  }
}
