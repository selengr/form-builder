import axios from "axios";
import AxiosApi from "@/services/axios/AxiosApi";
import { ConfirmPaymentRequestBody } from "../types";
import { IPurchaseOrder } from "@/types/shoppingCart";

export async function serviceCost() {
  try {
      const baseUrl = '/purchase-order/invoice';
      const response = await AxiosApi.get<IPurchaseOrder>(baseUrl);
      return response.data
  } catch (error: any) {
    return Promise.resolve(JSON.parse(error.message));
  }
}

 export const issueRequest = async () => {
    try {
      const {data} = await AxiosApi.post("/purchase-order/createIssueRequest");
      return data
    } catch (error) {
       return Promise.resolve("");
    }
  };


  export const userCreditList = async (issueRequestId: number) => {
    try {
      const body = {
        issueRequestId,
      };
      const response = await AxiosApi.post("/mhesam/profile/credit/user-credit-list",
        body,{
          baseURL: process.env.NEXT_PUBLIC_BASE_URL_PSYA,
      })
      return response.data;
    } catch (error) {
      return Promise.resolve("");
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
      const response = await AxiosApi.put("/communitycharge/service-cost/confirm",{temp});
      return response;
    } catch (error: any) {
      return Promise.resolve(JSON.parse(error.message));
    }
  }

  export async function connectToGateway(redirectUrl: string, amount: number) {
    try {
      const baseUrl = '/mhesam/profile/credit/before-gateway';
      const response = await AxiosApi.post(baseUrl,
        { redirectUrl, amount, failedRedirectUrl: redirectUrl },
        {
          baseURL: process.env.NEXT_PUBLIC_BASE_URL_PSYA,
       })
      return response.data;
    } catch (error: any) {
      return Promise.resolve(JSON.parse(error.message));
    }
  }



  // export async function userCreditList(issueRequestId: number) {
  //   try {
  //     let body = {
  //       issueRequestId,
  //     };
  //     console.log(
  //       "🚀 ~ userCreditList ~ body.issueRequestId:",
  //       body.issueRequestId
  //     );
  //     const response = await AxiosApi.post("/mhesam/profile/credit/user-credit-list",body
  //     );
  //     console.log("🚀 ~ userCreditList ~ response:", response);
  //     return response;
  //   } catch (error: any) {
  //     return JSON.parse(error);
  //   }
  // }


  

  

  

export async function twoFARequestHandler(
  nationalCode: string,
) {
  try {
      const response = await AxiosApi.post(`/check-nationalCode-send-code`,{nationalCode})
    return response.data
  } catch (error: any) {
    return Promise.resolve(JSON.parse(error.message));
  }
}







//   export async function serviceCost(planId: number) {
//     try {

//       const data = await axios.get(`https://newpl1api.qhami.com/mhesam/mhami/fp/samat-request/${planId}`,
//          {
       
//           headers: {
//             Authorization: `Bearer eyJraWQiOiJzaGFyZS1rZXktaWQiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIwOTU1MDAwMDAwNyIsImF1ZCI6InNzb0NsaWVudC0yIiwibmJmIjoxNzQ1MDA1NjE3LCJpc3MiOiJodHRwOi8vMTcyLjE2LjExLjI0OjgwODAvc3NvIiwiaWQiOiI3IiwiZXhwIjoxNzc1MDA1NjE3LCJpYXQiOjE3NDUwMDU2MTcsImp0aSI6Ijk3NzdhYmJiLTFlYTAtNGZmZC1iNGU4LWJjZTQyZWY1OTc5YiJ9.UwBlnlraYYczRa3PmhCHxsQ-2I_7kHzrZYVNlSRlGXIww9UJBnXNufiRNyXa0RMMJRfzFSF7LDdFfL7U8-3mymjjKNXShbSkUmEPmWwnvlJXvYC9vTj8fx2v1SbrunC2k_zcOkDi5NMtzARwcJI1Diysr48UL7vJE1Jdsd_h74aebSAjfHiGMTuKySqdcr-yhTzV1KD4MkLgwBfrcO0xw5_I9TqHWNEzSswEI7ZE-jLJ7UBkN5_lnmfryGjim-7-USKZXm3H-FvUtvQg8rUNRtl_EQqumi5eKxaTofE7xlw2z5qZQy6ysvOMvJZa11iqmdGVT8qw_fxwJksAxFxI3Q`
//           }
//          }
//       );
//       const res_samat = data.data

  
//       let body = {
//         selectedDuration: res_samat.selectedDuration,
//         selectedRefundTogether: !res_samat.selectedRefundMonthly,
//         amount: res_samat.amount,
//         monthlyAbilityPay: res_samat.monthlyAbilityPay,
//         totalAbilityPay: res_samat.totalAbilityPay,
//       };
//       console.log("🚀 ~ serviceCost ~ body:", body);
  
//       const response = await ApiRequest(
//         "Post",
//         {},
//         body,
//         "/communitycharge/service-cost",
//         true
//       );
//       console.log("🚀 ~ serviceCost ~ response:", response);
//       return response;
//     } catch (error: any) {
//       return Promise.resolve(JSON.parse(error.message));
//     }
//   }


