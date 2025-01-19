import { useCallback, useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import { CgClose } from "react-icons/cg";
import { z } from "zod";
import FormProvider, { RHFTextField } from "../hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import FieldSwitchPair from "./FieldSwitchPair";
import { IoSettingsOutline } from "react-icons/io5";
import { Typography } from "@mui/material";
import AxiosApi from "@/services/axios/AxiosApi";
import { useParams } from "next/navigation";
import { convertObject } from "@/lib/settingsUtils";

const responseLimitationOptions = [
  { label: "از طریق شماره همراه", value: "telephone" },
  { label: "از طریق ایمیل", value: "email" },
];

const layoutOptions = [
  { label: "نمایش فهرستی", value: "list-view" },
  { label: "نمایش صفحه ای", value: "page-view" },
];

const themeOptions = [{ label: "تم 1", value: "theme_1" }];

const fieldsConfig = [
  {
    name: "timeToComplete",
    label: "زمان شروع",
    type: "time-picker",
  },
  {
    name: "expireDate",
    label: "تاریخ فعال سازی و انقضا فرم",
    type: "date-picker",
  },
  {
    name: "responseLimitation",
    label: "محدودیت پاسخ‌‌دهی",
    type: "multi-select",
    options: responseLimitationOptions,
  },
  {
    name: "layout",
    label: "حالت نمایش",
    type: "multi-select",
    options: layoutOptions,
    disabled: true,
  },
  {
    name: "theme",
    label: "پوسته",
    type: "select",
    options: themeOptions,
    disabled: true,
  },
];

const propertiesSchema = z.object({
  name: z
    .string()
    .trim()
    .transform((value) => value.replace(/\s+/g, " "))
    .pipe(
      z
        .string()
        .min(2, { message: "حداقل باید 2 و حداکثر 100 کاراکتر باشد" })
        .max(100, { message: "حداقل باید 2 و حداکثر 100 کاراکتر باشد" })
    ),
  responseLimitation: z.object({
    value: z.array(z.string()),
    checked: z.boolean(),
  }),
  layout: z.object({
    value: z.array(z.string()),
    checked: z.boolean(),
  }),
  theme: z.object({
    value: z.string(),
    checked: z.boolean(),
  }),
  expireDate: z.object({
    value: z.any(),
    checked: z.boolean(),
  }),
  timeToComplete: z.object({
    value: z.any(),
    checked: z.boolean(),
  }),
});

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

export default function SettingsDialog() {
  const [openDialog, setOpenDialog] = useState(false);
  const { id: formId } = useParams();

  const handleOpen = useCallback(() => {
    setOpenDialog((prev) => !prev);
    reset();
  }, []);

  const methods = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "all",
    defaultValues: {
      name: "",
      expireDate: { checked: false, value: "" },
      timeToComplete: { checked: false, value: "" },
      responseLimitation: { checked: false, value: [] },
      layout: { checked: false, value: [] },
      theme: { checked: false, value: "" },
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  async function onSubmit(values: propertiesFormSchemaType) {
    const body = {
      ...convertObject(values as any, fieldsConfig),
      name: values.name,
    };

    try {
      const res = await AxiosApi.post(`/form-setting/${formId}`, body as any);
      handleOpen();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    reset();
  }, [openDialog]);

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          height: "40px",
          width: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <IoSettingsOutline color="#2A2A2A" />
      </IconButton>
      <Dialog
        open={openDialog}
        dir="ltr"
        sx={{
          overflow: "hidden",
          scrollbarWidth: "none",
          "& .MuiPaper-root": {
            borderRadius: "24px",
            margin: "10px",
          },
          "& .MuiDialog-container": {
            backdropFilter: "blur(4px)",
            backgroundColor: "hsl(0deg 0% 100% / 50%)",
          },
        }}
      >
        {openDialog && (
          <>
            <div className="flex items-center justify-start">
              <button className="mx-4 mt-4 mb-0" onClick={handleOpen}>
                <CgClose color="#404040" width={25} height={25} size="1.5rem" />
              </button>
            </div>
            <DialogContent
              dir="rtl"
              sx={{
                maxHeight: "75vh",
                scrollbarWidth: "thin",
                maxWidth: "100%",
                width: "450px",
                paddingX: 1,
                paddingTop: 0,
              }}
            >
              <div dir="rtl" className="flex flex-col pb-4 p-2">
                <div className="flex justify-center items-baseline mb-6">
                  <p className="font-bold text-center text-[20px]">
                    تنظیمات پرسشنامه
                  </p>
                </div>
                <FormProvider
                  methods={methods}
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      paddingX: 1.5,
                      direction: "ltr",
                      width: "100%",
                      gap: "20px",
                    }}
                  >
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Typography
                        variant="subtitle2"
                        fontWeight="600"
                        fontSize="15px"
                      >
                        نام پرسشنامه:
                      </Typography>
                      <RHFTextField
                        name="name"
                        sx={{
                          "& .MuiInputBase-root": {
                            borderRadius: "10px",
                            fontWeight: "600",
                          },
                        }}
                      />
                    </Box>
                    {fieldsConfig.map((field) => (
                      <FieldSwitchPair
                        key={field.name}
                        fieldName={field.name}
                        label={field.label}
                        type={field.type}
                        options={field.options}
                        disabled={field?.disabled}
                      />
                    ))}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "16px",
                      paddingX: "16px",
                      width: "100%",
                      marginTop: "38px",
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
                        height: "50px",
                        color: "white",
                        fontSize: "16px",
                        fontWeight: "700",
                        borderRadius: "10px",
                        boxShadow: "none",
                        "&.MuiButtonBase-root:hover, &.MuiButtonBase-root:active":
                          {
                            bgcolor: "#1758BA",
                            boxShadow: "none",
                          },
                      }}
                    >
                      ثبت
                    </LoadingButton>
                    <Button
                      disabled={isSubmitting}
                      type="button"
                      fullWidth
                      className="text-[16px] text-[#1758BA]"
                      sx={{
                        height: "50px",
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
                      onClick={handleOpen}
                    >
                      انصراف
                    </Button>
                  </Box>
                </FormProvider>
              </div>
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
}
