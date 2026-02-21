'use server';

import { serverApi } from '@/services/axios/serverApi';
import { ConfirmPaymentRequestBody } from '@/app/purchase-order/[purchaseOrderId]/gateway/types';

export async function confirmPaymentAction(body: ConfirmPaymentRequestBody) {
  try {
    const userCreditModelList = body.userCreditModelList.map((item:any) => ({
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

    const response = await serverApi.post(
      '/purchase-order/updateAndDeliveryIssueRequest',
      temp
    );

    return response;
  } catch (error: any) {
    return Promise.resolve(JSON.parse(error.message));
  }
}