"use client";
import FormProvider, {RHFCheckBox, RHFSwitch, RHFTextField,} from "../hook-form";
import {z} from "zod";
import {useCallback} from "react";
import {useForm} from "react-hook-form";
import {IoShareSocialSharp} from "react-icons/io5";
import {LuCopy, LuRefreshCcw} from "react-icons/lu";
import {zodResolver} from "@hookform/resolvers/zod";
import {Box, Button, Typography} from "@mui/material";

import Share from "../share-media/Share";
import CopyToClipboardButton from "../clipboard-button/CopyToClipBoardButton";

const DEFAULT_LINK = `${process.env.NEXT_PUBLIC_MBZ_DOMAIN}form`;

const propertiesSchema = z.object({
  link: z
    .string()
    .trim()
    .transform((value) => value.replace(/\s+/g, " "))
    .pipe(z.string()),
  publicationMainPageMethod: z.boolean(),
  capacityPublicLink: z.number().min(0),
  showUser: z.boolean(),
});

type PropertiesFormSchemaType = z.infer<typeof propertiesSchema>;

interface GeneralSettingsProps {
  handleOpen: () => void;
  formId: string | number;
  formData: {
    publicLink: string;
  };
}

const IconButtonContainer = ({children}: { children: React.ReactNode }) => (<Box
    sx={{
      padding: {xs: "8px", sm: "8px 15px"},
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "1px solid #1758BA",
      borderRadius: "10px",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "rgba(23, 88, 186, 0.08)",
      },
    }}
  >
    {children}
  </Box>);

export default function GeneralSettings({
                                          handleOpen, formId, formData,
                                        }: GeneralSettingsProps) {
  const FINAL_LINK = `${DEFAULT_LINK}/${formData.publicLink}`;

  const methods = useForm<PropertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema), mode: "all", defaultValues: {
      link: FINAL_LINK, publicationMainPageMethod: false, capacityPublicLink: 0, showUser: false,
    },
  });

  const {
    handleSubmit, reset, formState: {isSubmitting, isDirty}, setError,
  } = methods;

  const onSubmit = useCallback(async (values: PropertiesFormSchemaType) => {
    try {
      const response = await fetch('/api/publish/general', {
        method: 'POST', headers: {
          'Content-Type': 'application/json',
          "x-secret-token": process.env.NEXT_PUBLIC_SECRET!,
        }, body: JSON.stringify({
          formId: Number(formId),
          publicationMainPageMethod: values.publicationMainPageMethod,
          capacityPublicLink: values.capacityPublicLink,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error && data.details) {
          data.details.forEach((err: any) => {
            if (err.path && err.path[0]) {
              setError(err.path[0], {type: 'manual', message: err.message});
            }
          });
        } else if (data.error) {
          // alert(data.error);
        }
        return;
      }

      handleOpen();
      reset();
    } catch (error) {
      // alert("خطای ناشناخته در ارسال اطلاعات.");
    }
  }, [formId, handleOpen, reset, setError]);

  const handleCancel = useCallback(() => {
    handleOpen();
    reset();
  }, [handleOpen, reset]);


  return (<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          paddingX: 1.5,
          direction: "ltr",
          width: "100%",
          gap: 1,
        }}
      >
        <Box display="flex" gap={1} mt={4}>
          <IconButtonContainer>
            <LuRefreshCcw size="1.5rem" color="#1758BA"/>
          </IconButtonContainer>

          <RHFTextField
            name="link"
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            sx={{
              "& .MuiInputBase-root": {
                borderRadius: "10px", fontWeight: "600",
              },
            }}
          />

          <IconButtonContainer>
            <CopyToClipboardButton
              link={FINAL_LINK}
              icon={<LuCopy size="1.5rem" color="#1758BA"/>}
            />
          </IconButtonContainer>

          <IconButtonContainer>
            <Share
              shareData={{
                title: "لینک سایا", text: "لینک سایا", url: FINAL_LINK,
              }}
            >
              <IoShareSocialSharp size="1.5rem" color="#1758BA"/>
            </Share>
          </IconButtonContainer>
        </Box>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={3}
          mt={1}
        >
          <Box display="flex" flexDirection="column" gap={1} flex={1}>
            <Typography fontWeight={700} fontSize="14px">
              ظرفیت:
            </Typography>
            <Typography fontWeight={400} fontSize="12px" color="text.secondary">
              ظرفیت از پیش موجود 100 نفر
            </Typography>
            <RHFTextField
              type="number"
              name="capacityPublicLink"
              inputProps={{min: 0, style: {textAlign: "center"}}}
              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: "10px", fontWeight: 600, height: 42,
                },
              }}
            />
          </Box>

          <Box flex={1} mt={3}>
            <Typography
              fontSize="11px"
              lineHeight={1.6}
              textAlign="justify"
              color="text.secondary"
            >
              دسترسی به پرسشنامه از طریق پیوند به مقدار ظرفیت تعیین‌شده برای عموم آزاد
              است و پس از اتمام ظرفیت، دسترسی تا زمان افزودن ظرفیت مجدد محدود خواهد شد.
            </Typography>
          </Box>
        </Box>

        <Box display="flex" flexDirection="column" gap={2} mt={2}>
          <Box display="flex" alignItems="center">
            <RHFCheckBox name="publicationMainPageMethod" label={undefined}/>
            <Typography fontSize="12px" color="text.primary">
              در صفحه عمومی سایا قابل مشاهده باشد.
            </Typography>
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle2" fontWeight={500} fontSize="14px">
              نمایش نتیجه به پاسخ دهنده
            </Typography>
            <RHFSwitch
              name="showUser"
              sx={{
                mb: 1, mx: 0, width: 1, justifyContent: "space-between",
              }}
              label={undefined}
            />
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, px: 2, width: "100%", mt: 3,
        }}
      >
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isSubmitting || !isDirty || methods.watch("capacityPublicLink") === 0}
          sx={{
            bgcolor: "primary.main",
            height: 54,
            color: "white",
            fontSize: {xs: "13px", sm: "16px"},
            fontWeight: 700,
            borderRadius: "10px",
            boxShadow: "none",
            "&:hover, &:active": {
              bgcolor: "primary.dark", boxShadow: "none",
            },
          }}
        >
          افزودن به سبد خرید
        </Button>

        <Button
          disabled={isSubmitting}
          type="button"
          fullWidth
          variant="outlined"
          onClick={handleCancel}
          sx={{
            height: 54,
            fontWeight: 700,
            borderRadius: "10px",
            fontSize: {xs: "13px", sm: "16px"},
            color: "primary.main",
            borderColor: "primary.main",
            "&:hover": {
              bgcolor: "action.hover", borderColor: "primary.main",
            },
          }}
        >
          انصراف
        </Button>
      </Box>
    </FormProvider>);
}