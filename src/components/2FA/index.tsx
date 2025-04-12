"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Box, Button, Grid, Typography, useTheme } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import AuthCode from "react-auth-code-input";
import { toast } from 'sonner';
import Countdown from "react-countdown";
import { BiAlarm } from "react-icons/bi";
import type {
  ICheckNationalCodeResponse,
  TwoFABottomSheetProps,
} from "./types";
import { twoFARequestHandler } from "./actions";
// import BottomSheet from "@/components/BottomSheetModal";

import NationalCardIcon from "@/../public/images/purchase-order/NationalCard.svg";
import TwoFAIcon from "@/../public/images/purchase-order/TwoFAIcon.svg";
import BottomSheet from "../BottomSheet/BottomSheet";
import FormTextInput from "./text-input/form-text-input";

const NationalCodeSchema = z.object({
  nationalCode: z
    .string()
    .length(10, "کد ملی باید 10 رقم باشد")
    .regex(/^\d+$/, "کد ملی باید فقط شامل اعداد باشد"),
});

type NationalCodeType = z.infer<typeof NationalCodeSchema>;

export type OTPResponseType<T> = Partial<
  ICheckNationalCodeResponse &
    T & {
      otpCode: string;
    }
>;

export default function TwoFABottomSheet<T>({
  open,
  sendOtpInfo,
  resendOtpInfo,
  otpLength = 6,
  isLoadingConfirmation,
  onClose,
  onConfirm = () => {},
}: TwoFABottomSheetProps<T>) {
  const methods = useForm({
    resolver: zodResolver(NationalCodeSchema),
    defaultValues: {
      nationalCode: "",
    },
  });
  const { palette } = useTheme();
  const [currentActiveBottomSheet, setCurrentActiveBottomSheet] = useState<
    "NATIONAL_CODE" | "OTP"
  >("NATIONAL_CODE");
  const [sendOtpResponse, setSendOtpResponse] = useState<OTPResponseType<T>>();
  const [otpCode, setOtpCode] = useState<string>("");
  const [otpError, setOtpError] = useState<string>("");
  const [timer, setTimer] = useState(0);

  const {
    mutate: mutateCheckNationalCode,
    isPending: isPendingCheckNationalCode,
  } = useMutation({
    mutationFn: (nationalCode: string) => {
      const url =
        typeof sendOtpInfo.url === "string"
          ? sendOtpInfo.url
          : sendOtpInfo.url(nationalCode);
      let body = {};
      if (sendOtpInfo.body) {
        body =
          typeof sendOtpInfo.body === "object"
            ? sendOtpInfo.body
            : sendOtpInfo.body(nationalCode);
      }
      return twoFARequestHandler(url, body, sendOtpInfo.method);
    },
    onSuccess: (response: OTPResponseType<T>) => {
      console.log("🚀 ~ responseOTPPPPPPPPPPPPPP:", response);
      if (response.message) {
        toast.error(response.message[0].title);
      } else {
        setSendOtpResponse(response);
        setCurrentActiveBottomSheet("OTP");
        setTimer(2 * 60 * 1000 + Date.now());
      }
    },
  });

  const { mutate: mutateResendOtp, isPending: isPendingResendOtp } =
    useMutation({
      mutationFn: () => {
        const nationalCode = methods.getValues("nationalCode");
        const url =
          typeof resendOtpInfo.url === "string"
            ? resendOtpInfo.url
            : resendOtpInfo.url({ nationalCode, ...(sendOtpResponse as T) });
        let body = {};
        if (resendOtpInfo.body) {
          body =
            typeof resendOtpInfo.body === "object"
              ? resendOtpInfo.body
              : resendOtpInfo.body({ nationalCode, ...(sendOtpResponse as T) });
        }
        return twoFARequestHandler(url, body, resendOtpInfo.method);
      },
      onSuccess: (response: OTPResponseType<T>) => {
        console.log("🚀 ~ responsessssssssssssssssssssss:", response);
        if (response.message) {
          toast.error(response.message[0].title);
        } else {
          setSendOtpResponse((prev) =>
            typeof response === "object" ? { ...prev, ...response } : response
          );
          setCurrentActiveBottomSheet("OTP");
          setTimer(2 * 60 * 1000 + Date.now());
        }
      },
    });

  const handleClose = () => {
    methods.reset();
    onClose();
  };

  const handleOnSubmit = async (formData: NationalCodeType) => {
    mutateCheckNationalCode(formData.nationalCode);
  };

  function handleConfirmOtp() {
    if (otpCode.length === otpLength) {
      onConfirm({ otpCode, ...(sendOtpResponse ?? {}) } as OTPResponseType<T>);
    } else {
      setOtpError("کدتایید را کامل وارد نمایید.");
    }
  }

  useEffect(() => {
    if (open) {
      setCurrentActiveBottomSheet("NATIONAL_CODE");
    }
  }, [open]);

  return (
    <>
      <BottomSheet
        title={
          <Box display="flex" alignItems="center" marginRight="1rem">
            <Image src={NationalCardIcon} alt="کدملی" />
            <Typography marginLeft="0.4rem" variant="body2" fontWeight="bold">
              افزودن کدملی
            </Typography>
          </Box>
        }
        open={currentActiveBottomSheet === "NATIONAL_CODE" && open}
        onClose={handleClose}
      >
        <Box padding="1rem">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleOnSubmit)}>
              <FormTextInput name="nationalCode" label="کدملی" />
              <Box display="flex" marginTop="3rem">
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isPendingCheckNationalCode}
                  sx={{
                    borderRadius: "10px",
                    marginX: "0.4rem",
                    boxShadow: "none",
                    flex: 2,
                  }}
                >
                  دریافت کد تایید
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={handleClose}
                  sx={{
                    borderRadius: "10px",
                    marginX: "0.4rem",
                    boxShadow: "none",
                    flex: 1,
                  }}
                >
                  انصراف
                </Button>
              </Box>
            </form>
          </FormProvider>
        </Box>
      </BottomSheet>
      <BottomSheet
        title={
          <Box display="flex" alignItems="center" marginRight="1rem">
            <Image src={TwoFAIcon} alt="احراز هویت" />
            <Typography marginLeft="0.4rem" variant="body2" fontWeight="bold">
              احراز هویت
            </Typography>
          </Box>
        }
        open={currentActiveBottomSheet === "OTP" && open}
        onClose={handleClose}
      >
        <Box padding="1rem">
          <Typography variant="body2">
            کد احراز به شماره همراه {sendOtpResponse?.username} با سرشماره
            50004848 پیامک شد. کد ارسال شده را وارد کنید.
          </Typography>
          <Box width="100%" display="flex" marginTop="1.5rem">
            <AuthCode
              length={otpLength}
              onChange={(otpValue) => setOtpCode(otpValue)}
              allowedCharacters="numeric"
              containerClassName="flex justify-space-between flex-row-reverse w-full"
              inputClassName="w-10 h-10 text-center bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 mx-auto"
            />
          </Box>
          {otpError && (
            <Typography
              component="span"
              variant="caption"
              sx={{
                height: "14px",
                fontSize: "0.7rem",
                boxSizing: "border-box",
                paddingRight: "0.5rem",
              }}
              marginLeft="0.7rem"
              color="error"
            >
              {otpError}
            </Typography>
          )}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            marginY="2rem"
          >
            <Countdown
              key={timer}
              // onComplete={() => setTimer(0)}
              date={timer}
              renderer={({ minutes, seconds, completed }) =>
                completed ? (
                  <Button
                    onClick={() => {
                      mutateResendOtp();
                    }}
                    disabled={isPendingResendOtp}
                    size="small"
                    sx={{ marginX: "auto" }}
                  >
                    ارسال مجدد
                  </Button>
                ) : (
                  <>
                    <BiAlarm size="1.1rem" color={palette.grey[700]} />
                    <Typography
                      fontSize="0.8rem"
                      marginLeft="0.4rem"
                      color={palette.grey[700]}
                    >
                      {minutes}:{"00".concat(seconds.toString()).slice(-2)}
                    </Typography>
                  </>
                )
              }
            />
          </Box>
          <Box display="flex">
            <Button
              onClick={handleConfirmOtp}
              variant="contained"
              disabled={isLoadingConfirmation}
              sx={{
                borderRadius: "10px",
                marginX: "0.4rem",
                boxShadow: "none",
                flex: 2,
              }}
            >
              تایید
            </Button>
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{
                borderRadius: "10px",
                marginX: "0.4rem",
                boxShadow: "none",
                flex: 1,
              }}
            >
              انصراف
            </Button>
          </Box>
        </Box>
      </BottomSheet>
    </>
  );
}
