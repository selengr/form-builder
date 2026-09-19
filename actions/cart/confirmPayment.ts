'use server';

import { api } from '@/services/axios/actionWapper';
import { ConfirmPaymentRequestBody } from '@/app/purchase-order/[purchaseOrderId]/gateway/types';

export async function confirmPaymentAction(body: ConfirmPaymentRequestBody) {
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

  return api.post('/purchase-order/updateAndDeliveryIssueRequest', temp);
}
