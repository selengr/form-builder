import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { CgClose } from "react-icons/cg";
import { IoSettingsOutline } from "react-icons/io5";
import { z } from "zod";
import FormProvider, { RHFTextField } from "../hook-form";
import { LoadingButton } from "@mui/lab";
import AxiosApi from "@/services/axios/AxiosApi";
import PublishSettingsTabValue from "./PublishSettingsTabValue";

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
});

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

export default function PublishSettingsDialog() {
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpen = useCallback(() => {
    setOpenDialog((prev) => !prev);
    reset();
  }, []);

  const methods = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "all",
    defaultValues: {
      name: "",
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  async function onSubmit(values: propertiesFormSchemaType) {
    try {
      const res = await AxiosApi.post(`/form-setting`, values as any);
      handleOpen();
    } catch (error) {
      console.log(error);
    }
  }

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
                    تنظیمات انتشار
                  </p>
                </div>
                <PublishSettingsTabValue />
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
                    {/* <Box display="flex" flexDirection="column" gap={1}>
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
                    </Box> */}
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
                        fontSize: {
                          xs: "12px",
                          sm: "16px",
                        },
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
                      کسر از ظرفیت و انتشار
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
