"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Box, Button, Divider, MenuItem, Select, Typography, useTheme } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { formatNumberWithCommas } from "@/lib/numberFormatter";
import { useParams, usePathname, useRouter } from "next/navigation";
// import { enqueueSnackbar } from "notistack";
import type {
  ConfirmPaymentRequestBody,
  UserCreditListResponse,
} from "./types";
import { connectToGateway } from "./actions";
import { confirmPayment } from "./actions";
// import CustomHeader from "@/components/header/customHeader";
import { SelectedCreditCard } from "./SelectedCreditCard";
// import Autocomplete from "@/components/Autocomplete";
import TwoFABottomSheet, { type OTPResponseType } from "@/components/2FA";
// import BottomSheet from "@/components/BottomSheetModal";
// import MhesamEmptyCartPage from "@/../public/img/MhesamEmptyCartPage.svg";
// import PrerequestHeader from "../../components/PrerequestHeader";
import { BiChevronRight } from "react-icons/bi";
// import { useTranslation } from "@/services/i18n/client";
import { RHFSelect } from "@/components/hook-form";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import PrerequestHeader from "@/templates/purchase-order/PrerequestHeader";
import { ApiRequest } from "@/services/apiRequest";
import { useGetPurchaseOrder } from "../../_hook/useGetPurchaseOrder";
import AxiosApi from "@/services/axios/AxiosApi";
import { issueRequest, serviceCost, userCreditList } from "./_api/getIssueRequest";
import UICustomizedCombo from "@/components/customized_combo";



export type TAccount = {
  accountId: number;
  creditType: string;
  creditTypeEnum: string | 'MHESAM_DONATION' | 'MHESAM_NORMAL';
  totalAmount: number;
  availableAmount: number;
  order: number;
  expireDate: null | object | any;
};


export default function PayWithMHesam() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const { palette } = useTheme();

  // const { t } = useTranslation(["gateway"]);
  const [selectedCredits, setSelectedCredits] = useState<
    UserCreditListResponse[]
  >([]);
  const [creditList, setCreditList] = useState<UserCreditListResponse[]>([]);
  const [selectedCreditAmount, setSelectedCreditAmount] = useState(0);
  const [openModal, setOpenModal] = useState<"rules" | "2fa">();
  const [remainedAmount, setRemainedAmount] = useState(0);
  const [issueReques, setIssueRequest] = useState<{ issueRequestId: number }>();
  const [prevServiceCost, setPrevServiceCost] = useState<number>();

  const [chosenCredits, setChosenCredits] = useState<TAccount[] | 0>(0);
  const [account, setAccount] = useState<TAccount[]>();

  //  const {data:purchaseOrder,isLoading} = useGetPurchaseOrder()

  const { data, mutate: getServiceCost } = useMutation({
    mutationFn: () => serviceCost(+params.purchaseOrderId),
  });
  
  console.log('data :>> ', data);
  console.log('data.id :>> ', params.purchaseOrderId);

  // const { data } = useQuery({
  //   queryKey: ["serviceCost"],
  //   queryFn: () => serviceCost(+params.purchaseOrderId),
  // });
  // console.log("🚀 ~ data:", data);

  const { data: issueRequestData, error } = useQuery({
    queryKey: ["issueRequest"],
    queryFn: () => {
      return issueRequest();
    },
  });
  
useEffect(() => {
  const issueRequest = async () => {
    try {
      const response = await AxiosApi.post("/purchase-order/createIssueRequest"
      );
      console.log("🚀 ~ issueRequest ~ response:", response);
      return response;
    } catch (error) {
      console.error("Error occurred while issuing request:", error);
      // Handle error appropriately, e.g., show a notification or set an error state
      return Promise.resolve("");
    }
  };

  issueRequest();
}, [])
  console.log('issueRequestData :>> ', +issueRequestData?.issueRequestId);

  const { data: creditListData } = useQuery({
    queryKey: ["userCreditList"],
    queryFn: () => {
      return userCreditList(+issueRequestData?.issueRequestId);
    },
    enabled: Boolean(issueRequestData?.issueRequestId),
  });

  function handleAddCredit(credit: UserCreditListResponse | null) {
    console.log('credit :>> ', credit);
    
    if (credit === null) return;
    if (
      selectedCredits.findIndex(
        (item) => item.accountId === credit.accountId
      ) === -1 &&
      remainedAmount > 0
    ) {debugger
      setSelectedCreditAmount((prev) => {
        let totalCredit = prev + credit.availableAmount;
        let remained = +data?.totalAmount - totalCredit;
        setRemainedAmount(Math.max(remained, 0));
        return totalCredit;
      });
      if (
        typeof credit.expireDate === "string" ||
        Object.keys(credit.expireDate ?? {}).length === 0
      ) {debugger
        delete credit.expireDate;
      }
      setSelectedCredits((prev) => [...prev, credit]);
      setCreditList((prev) =>
        prev.filter((item) => item.accountId !== credit.accountId)
      );
    }
  }

  function handleRemoveCredit(credit: UserCreditListResponse): void {
    setSelectedCreditAmount((prev) => {
      let totalCredit = prev - credit.availableAmount;
      let remained = +data?.totalAmount - totalCredit;
      setRemainedAmount(Math.max(remained, 0));
      return totalCredit;
    });
    setCreditList((prev) => [...prev, credit]);
    setSelectedCredits((prev) =>
      prev.filter((item) => item.accountId !== credit.accountId)
    );
  }

  const handleCalculateRemainedSelectedCredit = (index: number) => {
    const item = selectedCredits[index];
    if (index === 0) {
      return Math.max(item.availableAmount - +data?.totalAmount, 0);
    }
    const prevItemsAmount = selectedCredits
      .slice(0, index)
      .reduce(
        (prevValue, currentValue) => prevValue + +currentValue.availableAmount,
        0
      );
    const remained = Math.max(+data?.totalAmount - prevItemsAmount, 0);
    return Math.max(item!.availableAmount - remained, 0);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (body: ConfirmPaymentRequestBody) => confirmPayment(body),
    onSuccess: (response) => {
      console.log("🚀 ~ response:", response);
      if (response.message) {
        // enqueueSnackbar(JSON.parse(response.message).message[0].title, {
        //   variant: "error",
        //   anchorOrigin: {
        //     vertical: "top",
        //     horizontal: "center",
        //   },
        // });
      } else {
        setOpenModal(undefined);
        // enqueueSnackbar("عضویت شما با موفقیت به‌روزرسانی شد.", {
        //   variant: "success",
        // });
        router.push(
          `${pathname.replace("gateway", "signature")}?uu-id=${issueReques?.issueRequestId}`
        );
      }
    },
  });

  const handleConfirmOtp = (res: OTPResponseType<{}>) => {
    let body: ConfirmPaymentRequestBody = {
      issueRequestId: +issueReques?.issueRequestId!,
      otpCode: res.otpCode ?? "",
      otpId: res.id ?? "",
      userCreditModelList: selectedCredits,
    };
    mutate(body);
  };

  const handleCheckServiceCost = (nextStep: () => void) => {
    getServiceCost({} as unknown as void, {
      onSuccess: (data) => {
        if (data.totalAmount === 0) {
          router.back();
        } else if (data.totalAmount === prevServiceCost) {
          nextStep();
        } else {
          router.back();
        }
      },
    });
  };

  const { mutate: connectToGatewayMutation } = useMutation({
    mutationFn: (amount: number) => {
      debugger;
      console.log(
        "🚀 ~ pathname:",
        window.location.href.replace("/gateway", "/service-cost")
      );
      return connectToGateway(
        window.location.href.replace("/gateway", "/service-cost"),
        amount
      );
    },
    onSuccess: (response) => {
      debugger;
      if (response.message) {
        // enqueueSnackbar(JSON.parse(response.message).message[0].title, {
        //   variant: "error",
        //   anchorOrigin: {
        //     horizontal: "center",
        //     vertical: "top",
        //   },
        // });
      } else {
        let newUrl = response.gatewayUrl.replace("www.", "");
        const param = {
          redirectUrl: response.redirectUrl,
          token: response.token,
        };
        const url = `${newUrl}?${new URLSearchParams(param)}`;
        window.location.href = url;
      }
    },
  });

  useEffect(() => {
    if (creditListData) {
      setCreditList(creditListData);
    }
  }, [creditListData]);

  // useEffect(() => {
  //   if (data) {
  //     setRemainedAmount(+data?.serviceCost);
  //   }
  // }, [data]);

  useEffect(() => {
    // debugger;
    if (issueRequestData) {
      setIssueRequest(issueRequestData);
    }
  }, [issueRequestData]);

  useEffect(() => {
    getServiceCost({} as unknown as void, {
      onSuccess: (data) => {
        setRemainedAmount(+data?.totalAmount);
        setPrevServiceCost(data.totalAmount);
        if (data.totalAmount === 0) {
          router.replace("/association/list");
        }
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnClickPay = () => {
    debugger;
    if (remainedAmount > 0) {
      connectToGatewayMutation(remainedAmount);
    } else {
      handleCheckServiceCost(() => setOpenModal("rules"));
    }
  };

  console.log("🚀 ~ creditList:", creditList);
  const selectedCredits2 = (value:  undefined | any) => {
    setChosenCredits(value);
  };

  return (
    creditList && (
      <Box sx={{justifyContent:"center",display:"flex",width:"100%",m:2}}>
        <PrerequestHeader
          title={"سبد خرید"}
          icon={<BiChevronRight size="1.7rem" color={"#292D32"} />}
          CB_onClick={() => router.push("/prerequest-loan/create")}
        >
          <Box padding="1rem">
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              padding="1rem"
              borderRadius="12px"
              sx={{
                background:
                  "linear-gradient(10deg, #2CDFC9 120.72%, #1758BA 97.32%)",
                color: palette.common.white,
              }}
            >
              <Typography variant="h6" component="p" fontSize="1rem">
                مبلغ سبد خرید
              </Typography>
              <Typography
                variant="h6"
                fontSize="1.3rem"
                component="p"
                fontWeight="bold"
              >
                {formatNumberWithCommas(data?.totalAmount)} تومان
              </Typography>
            </Box>
            <Typography marginTop="1.5rem" paddingX="0.5rem">
              برای ادامـه و پرداخـت خریـد خود ، میـتوانید اعتـبارات خـود را به
              ترتیب الویت انتخاب نمایید
            </Typography>
            <Box margin="2rem 0 1rem 0">
              <Typography variant="body2" marginBottom="0.7rem">
                انتخاب اعتبار
              </Typography>
              {/* <Autocomplete<UserCreditListResponse>
                variant="data"
                value={null}
                key={selectedCredits.length}
                disabled={remainedAmount <= 0}
                options={creditList || []}
                getOptionLabel={(option) =>
                  option?.creditTypeValue +
                  " - " +
                  // formatNumberWithCommas(option?.availableAmount.toString()) +
                  1111111 +
                  " تومان"
                }
                onChange={(event, value) =>
                  handleAddCredit(value as UserCreditListResponse)
                }
              /> */}




          <UICustomizedCombo
            account={creditList}
            placeholder={'جستجوی اعتبار'}
            label="لطفا اعتبارات خود را انتخاب نمائید"
            selectedCredits={handleAddCredit}
          />
  
              
            </Box>
            {selectedCredits.map((credit, index) => (
              <SelectedCreditCard
                key={credit.accountId}
                availableAmount={credit.availableAmount}
                creditTypeValue={credit.creditTypeValue}
                onDelete={() => handleRemoveCredit(credit)}
                remainedCredit={handleCalculateRemainedSelectedCredit(index)}
              />
            ))}

            {/* <Image
              src={MhesamEmptyCartPage}
              alt="لیست اعتبارات"
              style={{ margin: "2rem auto" }}
            /> */}
            <Box bgcolor="#F2F4F8" padding="1rem" borderRadius="12px">
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">مبلغ کل استفاده شده</Typography>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color={palette.primary.main}
                >
                  {formatNumberWithCommas(
                    Math.min(
                      selectedCreditAmount,
                      +data?.totalAmount
                    ).toString()
                  )}
                  تومان
                </Typography>
              </Box>
              <Divider sx={{ marginY: "1rem" }} />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">
                  مبلغ باقی مانده جهت شارژ اعتبار ام حسام
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color={palette.primary.main}
                >
                  {formatNumberWithCommas(remainedAmount.toString())} تومان
                </Typography>
              </Box>
            </Box>
            <Button
              fullWidth
              variant="contained"
              onClick={handleOnClickPay}
              sx={{
                fontSize: "1.1rem",
                marginTop: "5rem",
                marginBottom: "4rem",
                borderRadius: "0.5rem",
              }}
            >
              {remainedAmount > 0 ? "شارژ" : "تایید و پرداخت"}
            </Button>
          </Box>
        </PrerequestHeader>
        <BottomSheet
          open={openModal === "rules"}
          onClose={() => setOpenModal(undefined)}
        >
          <Box>
            <Box height="200px" display="flex" flexDirection="column">
              <Typography
                component="pre"
                sx={{
                  display: "inline-block",
                  whiteSpace: "wrap",
                  overflow: "auto",
                  height: "100%",
                }}
              >
                به زودی
              </Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              onClick={() => setOpenModal("2fa")}
              sx={{ boxShadow: "none", borderRadius: "0.5rem" }}
            >
              قوانین و مقررات را می پذیرم
            </Button>
          </Box>
        </BottomSheet>
        <TwoFABottomSheet
          open={openModal === "2fa"}
          onClose={() => setOpenModal(undefined)}
          onConfirm={handleConfirmOtp}
          isLoadingConfirmation={isPending}
          sendOtpInfo={{
            url: (nationalCode) =>
              `/send-otp?nationalcode=${nationalCode}&issueRequestId=${issueReques?.issueRequestId}`,
          }}
          resendOtpInfo={{
            body: (data) => ({
              otpId: data.id,
            }),
            url: "/communitycharge/service-cost/resend-otp",
            method: "Put",
          }}
        />
      </Box>
    )
  );
}
