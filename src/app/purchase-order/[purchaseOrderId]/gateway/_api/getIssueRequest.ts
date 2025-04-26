import { RequestMethodsType } from "@/components/2FA/types";
import { ApiRequest } from "@/services/apiRequest";
import AxiosApi from "@/services/axios/AxiosApi";
import { IPurchaseOrder } from "@/types/shoppingCart";
import axios from "axios";

 export const issueRequest = async () => {
    try {
      const {data} = await AxiosApi.post("/purchase-order/createIssueRequest"
      );
      
      return data
    } catch (error) {
      console.error("Error occurred while issuing request:", error);
      // Handle error appropriately, e.g., show a notification or set an error state
      return Promise.resolve("");
    }
  };


 export const userCreditList = async (issueRequestId: number) => {
    try {
      let body = {
        issueRequestId,
      };
      const response = await axios.post("https://newpl1api.qhami.com/mhesam/profile/credit/user-credit-list",
        body,
         {
       
          headers: {
            Authorization: `Bearer eyJraWQiOiJzaGFyZS1rZXktaWQiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIwOTM4MjczMDgxOCIsImF1ZCI6InNzb0NsaWVudC0yIiwibmJmIjoxNzQ1MzUxNzI3LCJpc3MiOiJodHRwOi8vc3NvLXNlcnZpY2UubmV3cGwxLnN2Yzo4MDgwIiwiaWQiOiIxMTI2NDkiLCJleHAiOjE3NzUzNTE3MjcsImlhdCI6MTc0NTM1MTcyNywianRpIjoiMzRiMjAxZWEtMGJiZC00ODNhLThkMzQtZGNiMTNiOTRhZDVlIn0.KhUZ6IN3HDkfoIcUSHL9-EnAY32V4nLdzRokOqceXyRqbIfv7SSl2Rw9kmo_Id7ij2VkgXIgb_4yiE3xcnkasfO4--ILoLROLAuqobKBvoANyl-6tFb6rwj6xn7VZQHC0Oig8DpigbHQyriH02nN80Uy6S-iwToai7GSYkUShz1sprkF3ExIRwIbariJ27IHug4McrZ6ycYqvl6FkNEBqgia5ct53j47AmMtOn1HtyL5ZDvMizTV4P9hzXmw2v3co97KqbCSSwhMMgTq1CoZGJbl1d5aEQR1LrVTPsaNu22s6pTldUkC3miIsO2qUjyNlxFnRHs1-2IKg3wb0imO8A`
          }
         }
      );
      console.log("🚀 ~ issueRequest ~ response:", response);
      return response.data;
    } catch (error) {
      console.error("Error occurred while issuing request:", error);
      // Handle error appropriately, e.g., show a notification or set an error state
      return Promise.resolve("");
    }
  };


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




  
  export async function serviceCost(planId: number) {
    try {
        const baseUrl = '/purchase-order/invoice';
        const response = await AxiosApi.get<IPurchaseOrder>(baseUrl);
        // debugger
        const test ={ totalAmount: 20 }
        return test;
    } catch (error: any) {
      return Promise.resolve(JSON.parse(error.message));
    }
  }

  export async function connectToGateway(redirectUrl: string, amount: number) {
    try {
      // const baseUrl = '/mhesam/profile/credit/before-gateway';
      // const response = await AxiosApi.post<any>(baseUrl,{ redirectUrl, amount, failedRedirectUrl: redirectUrl });
      
      

      // const response = await axios.post("https://newpl1api.qhami.com/mhesam/profile/credit/before-gateway",
      const response = await axios.post("https://newpl1api.qhami.com/mhesam/profile/credit/before-gateway",
         { redirectUrl, amount:100, failedRedirectUrl: redirectUrl },
         {
       
          headers: {
            Authorization: `Bearer eyJraWQiOiJzaGFyZS1rZXktaWQiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIwOTU1MDAwMDAwNyIsImF1ZCI6InNzb0NsaWVudC0yIiwibmJmIjoxNzQ1MDgwMDU5LCJpc3MiOiJodHRwOi8vMTcyLjE2LjExLjI0OjgwODAvc3NvIiwiaWQiOiI3IiwiZXhwIjoxNzc1MDgwMDU5LCJpYXQiOjE3NDUwODAwNTksImp0aSI6IjMxZjBkMzU4LTkwNzMtNGRlNi05ZjQ4LWY5YzIyNmNkZWZmZCJ9.d6t1H4u8s2VzzpFNS7mOJFC-njhAP70CX731oYgDo-4B3ta6sJbHmnvEXFkZ4Nz1DQwnDj6KY6cqNknMqtOmCWGUqRwVSpOwjTICKZA714IMJp8poFzzfJDPbAVhHlq0TxqywsCeKF2dmwYyG1B9yLRdG1TBg48Xb0OQBiEe96RVINkzlVtxEWaAY5bIcOpx_Y1uqsCISaqptIFC4iguXNcYBvwpbQE61KjnqbByT6eWAO4X-wgM5j327YlCR7jEH4D3tx3ZovN7CaH4Qxf2CDylMv_K3Xpm8_7tbMG93BdMWTNuc4cwCE63dUppX_mPZKzdJAOgavFBBGyTU0lwCQ`
          }
         }
      );


      // const response = ApiRequestNew(
      //   "Post",
      //   {},
      //   { redirectUrl, amount, failedRedirectUrl: redirectUrl },
      //   `/mhesam/profile/credit/before-gateway`,
      //   true,
      //   false
      // );
      // if (response.message) {
      //   console.log("🚀 ~ connectToGateway ~ response:", response.message);
      // }
      return response.data;
    } catch (error: any) {
      return Promise.resolve(JSON.parse(error.message));
    }
  }
  

  

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


