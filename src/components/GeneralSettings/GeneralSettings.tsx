"use client";
import { Box, Button, Typography } from "@mui/material";
import FormProvider, {
  RHFCheckBox,
  RHFSwitch,
  RHFTextField,
} from "../hook-form";
import { LuCopy, LuRefreshCcw } from "react-icons/lu";
import Share from "../share-media/Share";
import { IoShareSocialSharp } from "react-icons/io5";
import CopyToClipboardButton from "../clipboard-button/CopyToClipBoardButton";
import { LoadingButton } from "@mui/lab";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AxiosApi from "@/services/axios/AxiosApi";

const propertiesSchema = z.object({
  link: z
    .string()
    .trim()
    .transform((value) => value.replace(/\s+/g, " "))
    .pipe(
      z
        .string()
        .min(2, { message: "حداقل باید 2 و حداکثر 100 کاراکتر باشد" })
        .max(100, { message: "حداقل باید 2 و حداکثر 100 کاراکتر باشد" })
    ),
  publicationMainPageMethod: z.boolean(),
  capacityPublicLink: z.number(),
  showUser: z.boolean(),
});

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

export default function GeneralSettings({
  handleOpen,
  formId,
  formData,
}: {
  handleOpen: () => void;
  formId: string | number;
  formData : any;
}) {
  const methods = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "all",
    defaultValues: {
      link: formData.publicLink,
      publicationMainPageMethod: false,
      capacityPublicLink: 0,
      showUser: false,
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  async function onSubmit(values: propertiesFormSchemaType) {
    try {
      const res = await AxiosApi.post(`/form-publish-setting/public-method`, {
        formId,
        publicationMainPageMethod: values.publicationMainPageMethod,
        capacityPublicLink: values.capacityPublicLink,
      });
      handleOpen();
      reset();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          paddingX: 1.5,
          direction: "ltr",
          width: "100%",
          gap: "6px",
        }}
      >
        <Box display="flex" gap={1} mt={4}>
          <Box
            sx={{
              padding: {
                xs: "8px",
                sm: "8px 15px",
              },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #1758BA",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            <LuRefreshCcw size="1.5rem" color="#1758BA" />
          </Box>
          <RHFTextField
            name="link"
            sx={{
              "& .MuiInputBase-root": {
                borderRadius: "10px",
                fontWeight: "600",
              },
            }}
          />
          <Box
            sx={{
              padding: {
                xs: "8px",
                sm: "8px 15px",
              },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #1758BA",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            <CopyToClipboardButton
              text="https://psya.ir"
              icon={<LuCopy size="1.5rem" color="#1758BA" />}
            />
          </Box>
          <Box
            sx={{
              padding: {
                xs: "8px",
                sm: "8px 15px",
              },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #1758BA",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            <Share
              shareData={{
                title: "لینک سایا",
                text: "لینک سایا",
                url: "https://psya.ir",
              }}
            >
              <IoShareSocialSharp size="1.5rem" color="#1758BA" />
            </Share>
          </Box>
        </Box>
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "column", md: "row" }}
          alignItems="center"
          justifyContent="center"
          gap={2}
          mt={0.5}
        >
          <Box display="flex" flexDirection="column" gap={1} width="100%">
            <Typography fontWeight="700" fontSize="14px">
              ظرفیت:{" "}
              <Typography component="span" fontWeight="400" fontSize="12px">
                ظرفیت از پیش موجود 100 نفر
              </Typography>
            </Typography>
            <RHFTextField
              type="number"
              name="capacityPublicLink"
              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: "10px",
                  fontWeight: "600",
                },
              }}
            />
          </Box>
          <Typography fontSize="10px" width="100%" textAlign="justify">
            دسترسی به پرسشنامه از طریق پیوند به مقدار ظرفیت تعیین شده برای عموم
            آزاد است و پس از اتمام ظرفیت تعیین شده، دسترسی به پرسشنامه تا زمان
            افزودن ظرفیت مجدد، محدود خواهد شد.
          </Typography>
        </Box>
        <Box display="flex" flexDirection="column">
          <Box display="flex" gap="4px" alignItems="center">
            <RHFCheckBox label="" name="publicationMainPageMethod" />
            <Typography fontSize="12px" color="#161616">
              در صفحه عمومی سایا قابل مشاهده باشد.
            </Typography>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="subtitle2"
              fontWeight="500"
              color="#393939"
              fontSize="14px"
            >
              نمایش نتیجه به پاسخ دهنده
            </Typography>
            <RHFSwitch
              label=""
              name="showUser"
              labelPlacement="start"
              sx={{
                mb: 1,
                mx: 0,
                width: 1,
                justifyContent: "space-between",
              }}
            />
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          paddingX: "16px",
          width: "100%",
          marginTop: "24px",
        }}
      >
        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          loading={isSubmitting}
          disabled={isSubmitting}
          disableRipple
          sx={{
            bgcolor: "#1758BA",
            height: "54px",
            color: "white",
            fontSize: {
              xs: "13px",
              sm: "16px",
            },
            fontWeight: "700",
            borderRadius: "10px",
            boxShadow: "none",
            "&.MuiButtonBase-root:hover, &.MuiButtonBase-root:active": {
              bgcolor: "#1758BA",
              boxShadow: "none",
            },
          }}
        >
          افزودن به سبد خرید
        </LoadingButton>
        <Button
          disabled={isSubmitting}
          type="button"
          fullWidth
          className="text-[16px] text-[#1758BA]"
          sx={{
            height: "54px",
            fontWeight: "700",
            borderRadius: "10px",
            fontSize: "16px",
            color: "#1758BA",
            borderColor: "#1758BA",
            bgcolor: "white",
            "&.MuiButtonBase-root:hover": {
              bgcolor: "transparent",
              boxShadow: "none",
              color: "#1758BA",
            },
          }}
          variant="outlined"
          onClick={() => {
            handleOpen();
            reset();
          }}
        >
          انصراف
        </Button>
      </Box>
    </FormProvider>
  );
}
