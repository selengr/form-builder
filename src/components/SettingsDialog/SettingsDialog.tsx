import { useCallback, useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import { CgClose } from "react-icons/cg";
import { Box, Button, DialogContent, Stack, Typography } from "@mui/material";
import { z } from "zod";
import FormProvider, { RHFTextField } from "../hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import FieldCheckboxPair from "./FieldCheckBoxPair";

const limitOptions = [
  { label: "از طریق شماره همراه", value: "telephone" },
  { label: "از طریق ایمیل", value: "email" },
];

const layoutOptions = [
  { label: "نمایش فهرستی", value: "list" },
  { label: "نمایش صفحه ای", value: "page" },
];

const themeOptions = [{ label: "تم 1", value: "theme1" }];

const fieldsConfig = [
  {
    name: "expire",
    label: "تاریخ انقضا",
    type: "date-picker",
  },
  {
    name: "limit",
    label: "محدودیت پاسخ‌‌دهی",
    type: "multi-select",
    options: limitOptions,
  },
  {
    name: "layout",
    label: "حالت نمایش",
    type: "multi-select",
    options: layoutOptions,
  },
  {
    name: "theme",
    label: "پوسته",
    type: "select",
    options: themeOptions,
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
  limit: z.object({
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
  expire: z.object({
    value: z.any(),
    checked: z.boolean(),
  }),
});

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

export default function SettingsDialog() {
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpen = useCallback(() => {
    setOpenDialog((prev) => !prev);
  }, []);

  const methods = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "all",
    defaultValues: {
      name: "",
      expire: { checked: false, value: "" },
      limit: { checked: false, value: [] },
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
    console.log("submited: ", values);
  }

  useEffect(() => {
    reset();
  }, [openDialog]);

  return (
    <>
      <Button
        onClick={handleOpen}
        variant="contained"
        sx={{
          height: "58px",
          width: "100%",
          borderRadius: "10px",
          marginTop: 1,
          boxShadow: "none",
          backgroundColor: "#1758BA",
          "&.MuiButtonBase-root:hover": {
            backgroundColor: "#1758BA",
            boxShadow: "none",
          },
        }}
      >
        <p className="text-white text-[15px] font-bold">ذخیره و انتشار</p>
      </Button>
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
                    <Stack spacing={1}>
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
                    </Stack>
                    {fieldsConfig.map((field) => (
                      <FieldCheckboxPair
                        key={field.name}
                        fieldName={field.name}
                        label={field.label}
                        type={field.type}
                        options={field.options}
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
