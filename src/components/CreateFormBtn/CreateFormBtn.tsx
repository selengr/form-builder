"use client";

import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
  MenuItem,
} from "@mui/material";
import FormProvider from "../hook-form/FormProvider";
import { IoClose } from "react-icons/io5";
import { RHFTextField, RHFMultiSelectV0 } from "../hook-form";
import AxiosApi from "@/services/axios/AxiosApi";
import { toast } from "sonner";
import PlusIcon from "@/../public/images/home-page/Add-fill.svg";
import { useGetSubCategory } from "./hooks/useGetSubCategory";
import {
  IGetCategory,
  useGetParentCategory,
} from "./hooks/useGetParentCategory";

const propertiesSchema = z.object({
  name: z
    .string()
    .trim()
    .transform((value) => value.replace(/\s+/g, " "))
    .pipe(
      z
        .string()
        .min(2, { message: "حداقل باید 2 و حداکثر 50 کاراکتر باشد" })
        .max(50, { message: "حداقل باید 2 و حداکثر 50 کاراکتر باشد" })
    ),
  typeEnum: z.string().min(1, { message: "لطفا یک مورد را انتخاب کنید" }),
  categoryIds: z
    .array(z.number())
    .min(1, { message: "لطفا حداقل یک دسته بندی را انتخاب کنید" }), 
      // categoryIds: z.string().optional(),
  subCategoryIds: z
    .array(z.number())
    .min(1, { message: "لطفا حداقل یک دسته بندی را انتخاب کنید" }), 
});

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

export default function CreateFormBtn() {
  const router = useRouter();
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [tabValue, setTabValue] = useState("QUESTION");

  const { Category, isFetchingCategory } = useGetParentCategory();
  const { SubCategory, isFetchingSubCategory } = useGetSubCategory();

  console.log("Category : data?.datList :>> ", Category);

  const methods = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      typeEnum: "QUESTION",
      categoryIds : [],
      subCategoryIds : []
    },
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  console.log('watch :>> ', watch("categoryIds"));
  console.log('watch sub:>> ', watch("subCategoryIds"));
  async function onSubmit(values: propertiesFormSchemaType) {
    try {
      const response: any = await AxiosApi.post("/form", values as any);
      setIsLoadingData(true);
      toast.success("عملیات با موفقیت انجام شد");
      router.push(`/builder/${response?.data?.id}`);
    } catch (error: any) {
      console.log(error);
      setIsLoadingData(false);
    }
  }

  function handleClose() {
    if (isLoadingData || isSubmitting) return;
    setOpenDialog((prev) => !prev);
  }

  const handleTabChange = (_: any, newValue: any) => {
    setValue("typeEnum", newValue);
    setTabValue(newValue);
  };

  return (
    <Fragment>
      <IconButton
        onClick={handleClose}
        sx={{
          width: "100%",
          height: "100%",
          // bgcolor: "#ECFAFF",
          borderRadius: "16px",
          border: "1px solid #1758BA",
        }}
      >
        <Image src={PlusIcon} alt="" width={22} height={22} />
      </IconButton>

      <Dialog
        // open={openDialog}
        open={true}
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <IconButton
            disabled={isLoadingData || isSubmitting}
            aria-label="close"
            onClick={handleClose}
            sx={{ marginX: 1, marginTop: 1, marginBottom: 0 }}
          >
            <IoClose color="#404040" width={25} height={25} />
          </IconButton>
        </Box>
        <DialogContent
          dir="rtl"
          sx={{
            maxHeight: "75vh",
            height: "auto",
            scrollbarWidth: "none",
            maxWidth: "100%",
            width: "450px",
            paddingX: 1,
            paddingBottom: 1,
            paddingTop: 0,
          }}
        >
          <Box
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            mb={2}
          >
            <Typography
              variant="subtitle2"
              color="#404040"
              fontSize="16px"
              fontWeight="700"
            >
              فرم جدید
            </Typography>
          </Box>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                paddingX: 1.5,
                direction: "ltr",
                width: "100%",
              }}
            >
              <Stack spacing={1}>
                <Typography
                  variant="subtitle2"
                  fontWeight="600"
                  fontSize="15px"
                >
                  نام:
                </Typography>
                <RHFTextField
                  name="name"
                  sx={{
                    height: "48px",
                    "& .MuiInputBase-root": {
                      borderRadius: "10px",
                      fontWeight: "600",
                    },
                  }}
                />
              </Stack>

              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  mt: 5,
                }}
              >
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  sx={{
                    width: "100%",
                    border: "1px solid #d3d3d3",
                    borderRadius: "10px",
                    padding: "5px",
                    "& .MuiTabs-scroller": {
                      display: "flex",
                      justifyContent: "center",
                    },
                    "& .MuiButtonBase-root": {
                      zIndex: 10,
                    },
                    "& .Mui-selected": {
                      color: "white !important",
                    },
                    "& .MuiTabs-indicator": {
                      zIndex: 0,
                      height: "48px",
                      borderRadius: "10px",
                      bgcolor: "#1758BA",
                    },
                  }}
                >
                  <Tab
                    sx={{
                      "&.MuiButtonBase-root.MuiTab-root": {
                        minWidth: "30px",
                        color: "#000",
                        fontWeight: 600,
                        paddingX: "15px",
                        maxWidth: "80px",
                      },
                    }}
                    disableRipple={true}
                    value="QUESTION"
                    label="پرسشنامه"
                  />
                  <Tab
                    sx={{
                      "&.MuiButtonBase-root.MuiTab-root": {
                        minWidth: "30px",
                        color: "#000",
                        fontWeight: 600,
                        paddingX: "15px",
                        maxWidth: "80px",
                      },
                    }}
                    disableRipple={true}
                    value="TEST"
                    label="آزمون"
                  />
                  <Tab
                    sx={{
                      "&.MuiButtonBase-root.MuiTab-root": {
                        minWidth: "30px",
                        color: "#000",
                        fontWeight: 600,
                        paddingX: "15px",
                        maxWidth: "80px",
                      },
                    }}
                    disableRipple={true}
                    value="COMPETITION"
                    label="مسابقه"
                  />
                  <Tab
                    sx={{
                      "&.MuiButtonBase-root.MuiTab-root": {
                        minWidth: "30px",
                        color: "#000",
                        fontWeight: 600,
                        paddingX: "15px",
                        maxWidth: "80px",
                      },
                    }}
                    disableRipple={true}
                    value="SURVEY"
                    label="نظرسنجی"
                  />
                </Tabs>
              </Box>

              <Box
                display="flex"
                flexDirection="column"
                gap="6px"
                width="100%"
                mt="10px"
              >
                <Typography variant="subtitle2" fontWeight="700">
                  دسته بند‌ی‌ها:
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    direction: "ltr",
                    width: "100%",
                    paddingX: 0.5,
                    "& .MuiFormControl-root, & .MuiInputBase-root": {
                      borderRadius: "10px",
                    },
                  }}
                >
                  <RHFMultiSelectV0
                    sx={{
                      "& .MuiInputBase-root": {
                        bgcolor: "#fff",
                        paddingY: "8px",
                      },
                    }}
                    chip
                    checkbox
                    fullWidth
                    name="categoryIds"
                    options={Category ?? []}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    direction: "ltr",
                    width: "100%",
                    paddingX: 0.5,
                    marginTop: "8px",
                    "& .MuiFormControl-root, & .MuiInputBase-root": {
                      borderRadius: "10px",
                    },
                  }}
                >
                   <RHFMultiSelectV0
                    sx={{
                      "& .MuiInputBase-root": {
                        bgcolor: "#fff",
                        paddingY: "8px",
                      },
                    }}
                     chip
                    checkbox
                    fullWidth
                    name="subCategoryIds"
                    options={SubCategory ?? []}
                  />

                </Box>
              </Box>

              <Box
                display="flex"
                gap={3}
                width="100%"
                marginTop={5}
                marginBottom={2}
                paddingX="40px"
              >
                <Button
                  type="submit"
                  disableRipple
                  fullWidth
                  variant="contained"
                  loading={isSubmitting || isLoadingData}
                  sx={{
                    bgcolor: "#1758BA",
                    fontWeight: "400",
                    fontSize: "15px",
                    height: "50px",
                    borderRadius: "10px",
                    "&.MuiButtonBase-root:hover": {
                      bgcolor: "#1758BA",
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    component={"p"}
                    py={0.5}
                    fontWeight="600"
                  >
                    تایید
                  </Typography>
                </Button>

                <Button
                  type="button"
                  variant="outlined"
                  fullWidth
                  sx={{
                    bgcolor: "white",
                    height: "50px",
                    fontWeight: "400",
                    fontSize: "15px",
                    borderRadius: "10px",
                    color: "#1758BA",
                    borderColor: "#1758BA",
                    "&.MuiButtonBase-root:hover": {
                      bgcolor: "white",
                      color: "#1758BA",
                    },
                  }}
                  onClick={handleClose}
                  disabled={isLoadingData || isSubmitting}
                >
                  <Typography
                    color="#1758BA"
                    variant="body2"
                    component={"p"}
                    py={0.5}
                    fontWeight="600"
                  >
                    انصراف
                  </Typography>
                </Button>
              </Box>
            </Box>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
