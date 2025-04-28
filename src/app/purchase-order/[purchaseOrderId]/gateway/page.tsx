"use client";

import Image from "next/image";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { BiChevronRight } from "react-icons/bi";
import { useMutation, useQuery } from "@tanstack/react-query";
import { formatNumberWithCommas } from "@/lib/numberFormatter";
import { usePathname, useRouter } from "next/navigation";
import { Box, Button, Divider, Typography, useTheme } from "@mui/material";

// types
import type {
  UserCreditListResponse,
  ConfirmPaymentRequestBody,
} from "./types";
// components
import Autocomplete from "@/components/Autocomplete";
import { SelectedCreditCard } from "./SelectedCreditCard";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import TwoFABottomSheet, { type OTPResponseType } from "@/components/2FA";
// templates
import PrerequestHeader from "@/templates/purchase-order/PrerequestHeader";
// public
import MhesamEmptyCartPage from "@/../public/images/purchase-order/MhesamEmptyCartPage.svg";
// apis
import { confirmPayment, connectToGateway, issueRequest, serviceCost, userCreditList } from "./_api/getIssueRequest";



// -------------------------------------------------

export default function PayWithMHesam() {
  const router = useRouter();
  const pathname = usePathname();
  const { palette } = useTheme();
  const [selectedCredits, setSelectedCredits] = useState<
    UserCreditListResponse[]
  >([]);
  const [remainedAmount, setRemainedAmount] = useState<number>(0);
  const [openModal, setOpenModal] = useState<"rules" | "2fa">();
  const [prevServiceCost, setPrevServiceCost] = useState<number>();
  const [creditList, setCreditList] = useState<UserCreditListResponse[]>([]);
  const [selectedCreditAmount, setSelectedCreditAmount] = useState<number>(0);
  const [issueReques, setIssueRequest] = useState<{ issueRequestId: number }>();



  const { data, mutate: getServiceCost,isPendingIssueRequest } = useMutation({
    mutationFn: () => serviceCost(),
  });
  
  const { data: issueRequestData } = useQuery({
    queryKey: ["issueRequest"],
    queryFn: () => {
      return issueRequest();
    },
  });
  
    // useEffect(() => {
    //   const issueRequest = async () => {
    //     try {
    //       const response = await AxiosApi.post("/purchase-order/createIssueRequest"
    //       );
    //       return response;
    //     } catch (error) {
    //       return Promise.resolve("");
    //     }
    //   };
    //   issueRequest();
    // }, [])

  const { data: creditListData } = useQuery({
    queryKey: ["userCreditList"],
    queryFn: () => {
      return userCreditList(+issueRequestData?.issueRequestId);
    },
    enabled: Boolean(issueRequestData?.issueRequestId),
  });

  function handleAddCredit(credit: UserCreditListResponse | null) {
    
    if (credit === null) return;
    if (
      selectedCredits.findIndex(
        (item) => item.accountId === credit.accountId
      ) === -1 &&
      remainedAmount > 0
    ) {
      setSelectedCreditAmount((prev) => {
        const totalCredit = prev + credit.availableAmount;
        const remained = +data?.totalAmount - totalCredit;
        setRemainedAmount(Math.max(remained, 0));
        return totalCredit;
      });
      if (
        typeof credit.expireDate === "string" ||
        Object.keys(credit.expireDate ?? {}).length === 0
      ) {
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
      const totalCredit = prev - credit.availableAmount;
      const remained = +data?.totalAmount - totalCredit;
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
      if (response.message) {
        toast.error(JSON.parse(response.message).message[0].title)
      } else {
        setOpenModal(undefined);
        toast.success("عضویت شما با موفقیت به‌روزرسانی شد.")
        router.push(
          `${pathname.replace("gateway", "signature")}?uu-id=${issueReques?.issueRequestId}`
        );
      }
    },
  });

  const handleConfirmOtp = (res: OTPResponseType<any>) => {
    const body: ConfirmPaymentRequestBody = {
      issueRequestId: +issueReques!.issueRequestId!,
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
      return connectToGateway(
        window.location.href.replace("/gateway", "/purchaseOrderId"),
        amount
      );
    },
    onSuccess: (response) => {
      if (response.message) {
        toast.error(JSON.parse(response.message).message[0].title)
      } else {
        const newUrl = response.gatewayUrl.replace("www.", "");
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


  useEffect(() => {
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
    if (remainedAmount > 0) {
      connectToGatewayMutation(remainedAmount);
    } else {
      handleCheckServiceCost(() => setOpenModal("rules"));
    }
  };

  if(!data) return null
  if(isPendingIssueRequest) return "loading..."

  return (
    // creditList && (
      <Box sx={{justifyContent:"center",display:"flex",width:"100%",m:0}}>
        <PrerequestHeader
          title={"سبد خرید"}
          icon={<BiChevronRight size="1.7rem" color={"#292D32"} />}
          CB_onClick={() => router.push("/purchase-order")}
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
                {isPendingIssueRequest ? "---" : formatNumberWithCommas(data?.totalAmount) + "تومان"}
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
              <Autocomplete<UserCreditListResponse>
                variant="data"
                value={null}
                key={selectedCredits.length}
                disabled={remainedAmount <= 0}
                loading={true}
                loadingText={true}
                options={creditList || []}
                getOptionLabel={(option) =>
                  option?.creditTypeValue +
                  " - " +
                  formatNumberWithCommas(option?.availableAmount.toString()) +
                  " تومان"
                }
                onChange={(event, value) =>
                  handleAddCredit(value as UserCreditListResponse)
                }
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

            <Image
              src={MhesamEmptyCartPage}
              alt="لیست اعتبارات"
              style={{ margin: "2rem auto" }}
            />
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
              `/send-otp?nationalcode=${nationalCode}&issueRequestId=${issueRequestData?.issueRequestId}`,
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
    // )
  );
}