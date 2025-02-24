import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormProvider, { RHFSelect, RHFSwitch } from "../hook-form";
import { Box, Button, MenuItem, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { MyRangeSlider } from "../Slider/RangeSlider";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

const propertiesSchema = z.object({
  city: z.string().optional(),
  education: z.string().optional(),
  age: z.string().optional(),
  gender: z.string().optional(),
  job: z.string().optional(),
  show: z.boolean().default(false).optional(),
});

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

const marks = [
  { value: 0, label: "0" },
  { value: 3000, label: "3000" },
];

function MresalatUsersSettings({ handleOpen }: { handleOpen: () => void }) {
  const methods = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onChange",
    defaultValues: {
      city: "",
      education: "",
      age: "",
      gender: "",
      job: "",
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

  const CustomValueLabel = ({ value }: { value: number }) => {
    const isMark = marks.some((mark) => mark.value === value);
    return (
      <Box>
        {isMark ? (
          <MdOutlineKeyboardArrowDown size={25} />
        ) : (
          <span>{value}</span>
        )}
      </Box>
    );
  };

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
          <Box display="flex" flexDirection="column" gap="8px" width="75%">
            <Typography variant="subtitle2" fontWeight="700">
              شهر/استان:
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
                disabled
                fullWidth
                name="city"
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
          <Box display="flex" flexDirection="column" gap="8px" width="25%">
            <Box display="flex" flexDirection="column" gap="8px" width="100%">
              <Typography variant="subtitle2" fontWeight="700">
                تحصیلات:
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
                  disabled
                  fullWidth
                  name="education"
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
        </Box>
        <Box display="flex" gap={1} width="100%">
          <Box display="flex" flexDirection="column" gap="8px" width="100%">
            <Typography variant="subtitle2" fontWeight="700">
              بازه سنی:
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
                disabled
                fullWidth
                name="age"
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
                disabled
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
          <Box display="flex" flexDirection="column" gap="8px" width="100%">
            <Typography variant="subtitle2" fontWeight="700">
              شغل:
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
                disabled
                fullWidth
                name="job"
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
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          gap="16px"
          width="100%"
          px={2}
        >
          <Typography
            fontSize="13px"
            fontWeight="700"
            mt={2}
            textAlign="center"
          >
            از تعداد ۳۰۰۰ نفر عضو یافت شده، شما ۱۵۰۰ نفر را انتخاب کرده‌ایید.
          </Typography>
          <MyRangeSlider
            marks={marks}
            valueLabelDisplay="auto"
            valueLabelFormat={(val: any) => <CustomValueLabel value={val} />}
            step={1}
            min={0}
            max={3000}
          />
        </Box>
      </Box>
      <Typography fontSize="10px">ظرفیت باقی‌مانده 300 نفر.</Typography>
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
          تایید و کسر از ظرفیت
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

export default MresalatUsersSettings;
