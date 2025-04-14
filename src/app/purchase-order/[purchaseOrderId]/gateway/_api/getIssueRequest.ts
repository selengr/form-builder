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
      const response = await axios.post("http://172.16.11.24:8080/mhesam/profile/credit/user-credit-list",
        body,
         {
       
          headers: {
            Authorization: `Bearer eyJraWQiOiJzaGFyZS1rZXktaWQiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIwOTU1MDAwMDAwNyIsImF1ZCI6InNzb0NsaWVudC0yIiwibmJmIjoxNzQ0MDYwNDI2LCJpc3MiOiJodHRwOi8vMTcyLjE2LjExLjI0OjgwODAvc3NvIiwiaWQiOiI3IiwiZXhwIjoxNzc0MDYwNDI2LCJpYXQiOjE3NDQwNjA0MjYsImp0aSI6IjFjMTY4ZmYwLTA5YjQtNGEzYy1hMDRiLWM1Y2EyNWNlNzAzNyJ9.laT7pUnDdkQFhDbza5Y8w_herhkDDfn2OAGMMiSqt53qNE_UGTQSEa-VfgCkqVRroYplIZjbNsoFxhNq1qslJGpmyFcKfhs0QSuig7ol7-jssaFRRStSl2V8Vch51ocflt8QM25Aid84hbH3YzoPECzSfanxLuo3IyEGkH9baQttjS7jQ8BY6E9J4qmMWzzxQkzUpOSmpJMNatY73tipsSLvZ6TDuHEvM2VXYXGyKKccQ199y-r4wLVVLaYA4ZlW5nOKSxTmCxdW8TcB1h1LnrwYenBywGx3Dp9LNC3_pz1g8JVdOvRqmf0wkPzloXZuZZwTDVXoZag3rMVPrQCHDA`
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
        return response.data;
    } catch (error: any) {
      return Promise.resolve(JSON.parse(error.message));
    }
  }

  export async function connectToGateway(redirectUrl: string, amount: number) {
    try {
      // const baseUrl = '/mhesam/profile/credit/before-gateway';
      // const response = await AxiosApi.post<any>(baseUrl,{ redirectUrl, amount, failedRedirectUrl: redirectUrl });
      
      

      const response = await axios.post("http://172.16.11.24:8080/mhesam/profile/credit/before-gateway",
         { redirectUrl, amount : 20, failedRedirectUrl: redirectUrl },
         {
       
          headers: {
            Authorization: `Bearer eyJraWQiOiJzaGFyZS1rZXktaWQiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIwOTU1MDAwMDAwNyIsImF1ZCI6InNzb0NsaWVudC0yIiwibmJmIjoxNzQ0MDYwNDI2LCJpc3MiOiJodHRwOi8vMTcyLjE2LjExLjI0OjgwODAvc3NvIiwiaWQiOiI3IiwiZXhwIjoxNzc0MDYwNDI2LCJpYXQiOjE3NDQwNjA0MjYsImp0aSI6IjFjMTY4ZmYwLTA5YjQtNGEzYy1hMDRiLWM1Y2EyNWNlNzAzNyJ9.laT7pUnDdkQFhDbza5Y8w_herhkDDfn2OAGMMiSqt53qNE_UGTQSEa-VfgCkqVRroYplIZjbNsoFxhNq1qslJGpmyFcKfhs0QSuig7ol7-jssaFRRStSl2V8Vch51ocflt8QM25Aid84hbH3YzoPECzSfanxLuo3IyEGkH9baQttjS7jQ8BY6E9J4qmMWzzxQkzUpOSmpJMNatY73tipsSLvZ6TDuHEvM2VXYXGyKKccQ199y-r4wLVVLaYA4ZlW5nOKSxTmCxdW8TcB1h1LnrwYenBywGx3Dp9LNC3_pz1g8JVdOvRqmf0wkPzloXZuZZwTDVXoZag3rMVPrQCHDA`
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
  


//   export async function serviceCost(planId: number) {
//     try {

//       const data = await axios.get(`http://172.16.11.24:8080/mhesam/mhami/fp/samat-request/${planId}`,
//          {
       
//           headers: {
//             Authorization: `Bearer eyJraWQiOiJzaGFyZS1rZXktaWQiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIwOTU1MDAwMDAwNyIsImF1ZCI6InNzb0NsaWVudC0yIiwibmJmIjoxNzQ0MDYwNDI2LCJpc3MiOiJodHRwOi8vMTcyLjE2LjExLjI0OjgwODAvc3NvIiwiaWQiOiI3IiwiZXhwIjoxNzc0MDYwNDI2LCJpYXQiOjE3NDQwNjA0MjYsImp0aSI6IjFjMTY4ZmYwLTA5YjQtNGEzYy1hMDRiLWM1Y2EyNWNlNzAzNyJ9.laT7pUnDdkQFhDbza5Y8w_herhkDDfn2OAGMMiSqt53qNE_UGTQSEa-VfgCkqVRroYplIZjbNsoFxhNq1qslJGpmyFcKfhs0QSuig7ol7-jssaFRRStSl2V8Vch51ocflt8QM25Aid84hbH3YzoPECzSfanxLuo3IyEGkH9baQttjS7jQ8BY6E9J4qmMWzzxQkzUpOSmpJMNatY73tipsSLvZ6TDuHEvM2VXYXGyKKccQ199y-r4wLVVLaYA4ZlW5nOKSxTmCxdW8TcB1h1LnrwYenBywGx3Dp9LNC3_pz1g8JVdOvRqmf0wkPzloXZuZZwTDVXoZag3rMVPrQCHDA`
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

