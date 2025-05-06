"use client";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import FormProvider, {RHFMultiSelect, RHFSelect, RHFSwitch, RHFTextField,} from "../hook-form";
import {Box, Button, MenuItem, Typography} from "@mui/material";

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
  family: z
    .string()
    .trim()
    .transform((value) => value.replace(/\s+/g, " "))
    .pipe(
      z
        .string()
        .min(2, { message: "حداقل باید 2 و حداکثر 50 کاراکتر باشد" })
        .max(50, { message: "حداقل باید 2 و حداکثر 50 کاراکتر باشد" })
    ),
  phone: z
    .string()
    .regex(/^09\d{9}$/, {
      message: "شماره تلفن باید با 09 شروع شود و دقیقاً 11 رقم داشته باشد",
    })
    .trim()
    .transform((value) => value.replace(/\s+/g, "")),
  gender: z.string().min(1, { message: "الزامی است" }),
  group: z.string().optional(),
  show: z.boolean().default(false).optional(),
});

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

function IndividualSettings({ handleOpen }: { handleOpen: () => void }) {
  const methods = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      family: "",
      phone: "",
      gender: "",
      group: "",
      show: false,
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  async function onSubmit(values: propertiesFormSchemaType) {
    console.log(values);
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
          bgcolor: "#F7F7FF",
          borderRadius: "8px",
          padding: 2,
          marginY: 2,
          gap: 1,
        }}
      >
        <Box display="flex" gap={1} width="100%">
          <Box display="flex" flexDirection="column" gap="8px" width="100%">
            <Typography variant="subtitle2" fontWeight="700">
              نام:
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
              <RHFTextField
                sx={{
                  "& .MuiInputBase-root": {
                    bgcolor: "#fff",
                    paddingY: "0",
                  },
                }}
                name="name"
                fullWidth
              />
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" gap="8px" width="100%">
            <Typography variant="subtitle2" fontWeight="700">
              نام خانوادگی:
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
              <RHFTextField
                sx={{
                  "& .MuiInputBase-root": {
                    bgcolor: "#fff",
                    paddingY: "0",
                  },
                }}
                name="family"
                fullWidth
              />
            </Box>
          </Box>
        </Box>
        <Box display="flex" gap={1} width="100%">
          <Box display="flex" flexDirection="column" gap="8px" width="100%">
            <Typography variant="subtitle2" fontWeight="700">
              تلفن همراه:
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
              <RHFTextField
                sx={{
                  "& .MuiInputBase-root": {
                    bgcolor: "#fff",
                    paddingY: "0",
                  },
                }}
                name="phone"
                type="tel"
                slotProps={{
                  htmlInput: {
                    maxLength: 11,
                  },
                }}
                fullWidth
              />
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" gap="8px" width="100%">
            <Typography variant="subtitle2" fontWeight="700">
              جنسیت:
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
              <RHFSelect
                fullWidth
                name="gender"
                sx={{
                  "& .MuiInputBase-root": {
                    bgcolor: "#fff",
                  },
                }}
              >
                {[
                  { value: "male", label: "مرد" },
                  { value: "female", label: "زن" },
                ].map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Box>
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" gap="8px" width="100%">
          <Typography variant="subtitle2" fontWeight="700">
            گروه:
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
            <RHFMultiSelect
              sx={{
                "& .MuiInputBase-root": {
                  bgcolor: "#fff",
                  paddingY: "8px",
                },
              }}
              fullWidth
              name="group"
              disabled
              options={[]}
            />
          </Box>
        </Box>
      </Box>
      <Typography fontSize="10px">ظرفیت باقی‌مانده 30 نفر.</Typography>
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
          name="show"
          labelPlacement="start"
          sx={{
            mb: 1,
            mx: 0,
            width: 1,
            justifyContent: "space-between",
          }}
        />
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
        <Button
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
          تایید و کسر از ظرفیت
        </Button>
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

export default IndividualSettings;
