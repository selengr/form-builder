// // "use server";

// import { ApiRequest } from "@/services/apiRequest";
//  
// import { ApiRequestNew } from "@/services/apiRequestNew";

// export async function userCreditList(issueRequestId: number) {
//   try {
//     let body = {
//       issueRequestId,
//     };
//     console.log(
//       "🚀 ~ userCreditList ~ body.issueRequestId:",
//       body.issueRequestId
//     );
//     const response = await ApiRequest(
//       "Post",
//       {},
//       body,
//       "/mhesam/profile/credit/user-credit-list",
//       true
//     );
//     console.log("🚀 ~ userCreditList ~ response:", response);
//     return response;
//   } catch (error: any) {
//     return JSON.parse(error);
//   }
// }

// export async function confirmPayment(body: ConfirmPaymentRequestBody) {
//   try {
//     let userCreditModelList = body.userCreditModelList.map((item) => ({
//       accountId: item.accountId,
//       creditType: item.creditType,
//       creditTypeEnum: item.creditTypeEnum,
//       totalAmount: item.totalAmount,
//       availableAmount: item.availableAmount,
//       order: item.order,
//     }));
//     let temp = {
//       issueRequestId: +body.issueRequestId,
//       otpCode: body.otpCode,
//       otpId: body.otpId,
//       userCreditModelList,
//     };
//     const response = await ApiRequestNew(
//       "Put",
//       {},
//       temp,
//       "/communitycharge/service-cost/confirm",
//       true
//     );
//     console.log("🚀 ~ confirmPayment ~ response:", response);
//     return response;
//   } catch (error: any) {
//     return Promise.resolve(JSON.parse(error.message));
//   }
// }

// export async function serviceCost(purchaseOrderId: number) {
//   try {
//     const res_samat = await ApiRequest(
//       "Get",
//       {},
//       {},
//       `/mhami/fp/samat-request/${purchaseOrderId}`,
//       true,
//       false
//     );
//     console.log('=========================res_samat :>> ', res_samat);

//     let body = {
//       selectedDuration: res_samat.selectedDuration,
//       selectedRefundTogether: !res_samat.selectedRefundMonthly,
//       amount: res_samat.amount,
//       monthlyAbilityPay: res_samat.monthlyAbilityPay,
//       totalAbilityPay: res_samat.totalAbilityPay,
//     };
//     console.log("🚀 ~ serviceCost ~ body:", body);

//     const response = await ApiRequest(
//       "Post",
//       {},
//       body,
//       "/communitycharge/service-cost",
//       true
//     );
    
//     console.log("🚀 ~ serviceCost ~ response:", response);
//     return response;
//   } catch (error: any) {
//     return Promise.resolve(JSON.parse(error.message));
//   }
// }

// export async function issueRequest(feeId: number) {
//   try {
//     // let body = {
//     //   feeId,
//     //   //FIXME:اینجا بعدا باید مقدارش عوض بشه و مقدار COMMUNITY_CHARGE بگیره
//     //   //FIXME:اینجا در زمان توسعه مقدار باید mhesam بگیره
//     //   instanceEnTitle: "COMMUNITY_CHARGE",
//     // };
//     const response = await ApiRequest(
//       "Post",
//       {},
//       {},
//       "/purchase-order/createIssueRequest",
//       true
//     );
//     console.log(
//       "🚀 ~ issueRequest ~ bodyyyyyyyyyyyyyyyyyyyyyyyyyyy:",
//       response
//     );
//     return response;
//   } catch (error: any) {
//     return Promise.resolve(JSON.parse(error.message));
//   }
// }

// export async function connectToGateway(redirectUrl: string, amount: number) {
//   try {
//     const response = ApiRequestNew(
//       "Post",
//       {},
//       { redirectUrl, amount, failedRedirectUrl: redirectUrl },
//       `/mhesam/profile/credit/before-gateway`,
//       true,
//       false
//     );
//     if (response.message) {
//       console.log("🚀 ~ connectToGateway ~ response:", response.message);
//     }
//     return response;
//   } catch (error: any) {
//     return Promise.resolve(JSON.parse(error.message));
//   }
// }
