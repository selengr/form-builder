"use client";

import {useEffect, useState} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import FormProvider, {RHFMultiSelect, RHFSelect, RHFSwitch, RHFTextField,} from "../hook-form";
import {Box, Button, MenuItem, Typography} from "@mui/material";
import {toast} from "sonner";
import {getAuthToken} from "@/utils/getAuthToken";

interface GroupComboItem {
    value: string;
    caption: string;
}

const textFieldCommonSx = {
    "& .MuiInputBase-root": {
        bgcolor: "#fff",
        borderRadius: "10px",
        paddingY: "0",
    },
};

const inputFieldContainerSx = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    width: "100%",
    paddingX: 0.5,
};

const nameSchema = z
    .string()
    .trim()
    .transform((value) => value.replace(/\s+/g, " "))
    .pipe(
        z
            .string()
            .min(2, {message: "حداقل باید 2 و حداکثر 50 کاراکتر باشد"})
            .max(50, {message: "حداقل باید 2 و حداکثر 50 کاراکتر باشد"})
    );

const propertiesSchema = z.object({
    name: nameSchema,
    family: nameSchema,
    phone: z
        .string()
        .trim()
        .transform((value) => value.replace(/\s+/g, ""))
        .pipe(
            z.string().regex(/^09\d{9}$/, {
                message: "شماره تلفن باید با 09 شروع شود و دقیقاً 11 رقم داشته باشد",
            })
        ),
    gender: z.enum(["MALE", "FEMALE"], {
        message: "جنسیت الزامی است و باید male یا female باشد",
    }),
    group: z.string().optional(),
    show: z.boolean().default(false).optional(),
});

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

function IndividualSettings({handleOpen, formId,}: { handleOpen: () => void; formId: string | number; }) {
    const [groupOptions, setGroupOptions] = useState<GroupComboItem[]>([]);

    const methods = useForm<propertiesFormSchemaType>({
        resolver: zodResolver(propertiesSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            family: "",
            phone: "",
            gender: undefined,
            group: "",
            show: false,
        },
    });

    const {
        handleSubmit,
        reset,
        formState: {isSubmitting, isValid},
        setError,
    } = methods;

    useEffect(() => {
        async function fetchGroups() {
            try {
                const params = {
                    type: "COMBO",
                    entity: "QUESTIONS",
                    mode: "QUESTIONS_IN_FORM_BUILDER__ALL",
                    input: "",
                    page: 0,
                    rows: 10000,
                };

                const search = new URLSearchParams({
                    customComboFilterModel: JSON.stringify(params),
                });
                const token = await getAuthToken();

                const response = await fetch(
                    `/api/group/combo?${search.toString()}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (response.ok) {
                    setGroupOptions(data.dataList);
                } else {
                    toast.error(data.error || "خطا در دریافت گروه‌ها");
                }
            } catch (err) {
                toast.error("ارتباط با سرور برقرار نشد");
            }
        }

        fetchGroups();
    }, []);

    async function onSubmit(values: propertiesFormSchemaType) {
        const token = await getAuthToken();
        try {
            const response = await fetch("/api/publish/individual", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    formId: formId.toString(),
                    name: values.name,
                    lname: values.family,
                    username: values.phone,
                    gender: values.gender,
                    groupId: values.group || null,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.error && data.details) {
                    data.details.forEach((err: any) => {
                        if (err.path && err.path[0]) {
                            setError(err.path[0], {
                                type: "manual",
                                message: err.message,
                            });
                        }
                    });
                } else if (data.error) {
                    toast.error(data.error.toString());
                }
                return;
            }

            toast.success("با موفقیت به سبد خرید افزوده شد.");
            handleOpen();
            reset();
        } catch (error) {
            toast.error("خطای ناشناخته در ارسال اطلاعات.");
        }
    }

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    bgcolor: "#F7F7FF",
                    borderRadius: "8px",
                    padding: 2,
                    marginY: 2,
                    gap: 1,
                    direction: "ltr",
                }}
            >
                <Box display="flex" gap={1} width="100%">
                    <Box sx={inputFieldContainerSx}>
                        <Typography variant="subtitle2" fontWeight="700">
                            نام:
                        </Typography>
                        <RHFTextField sx={textFieldCommonSx} name="name" fullWidth/>
                    </Box>
                    <Box sx={inputFieldContainerSx}>
                        <Typography variant="subtitle2" fontWeight="700">
                            نام خانوادگی:
                        </Typography>
                        <RHFTextField sx={textFieldCommonSx} name="family" fullWidth/>
                    </Box>
                </Box>

                <Box display="flex" gap={1} width="100%">
                    <Box sx={inputFieldContainerSx}>
                        <Typography variant="subtitle2" fontWeight="700">
                            تلفن همراه:
                        </Typography>
                        <RHFTextField
                            sx={textFieldCommonSx}
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
                    <Box sx={inputFieldContainerSx}>
                        <Typography variant="subtitle2" fontWeight="700">
                            جنسیت:
                        </Typography>
                        <RHFSelect fullWidth name="gender" sx={textFieldCommonSx}>
                            <MenuItem value="">انتخاب کنید</MenuItem>
                            {[
                                {value: "MALE", label: "مرد"},
                                {value: "FEMALE", label: "زن"},
                            ].map((item) => (
                                <MenuItem key={item.value} value={item.value}>
                                    {item.label}
                                </MenuItem>
                            ))}
                        </RHFSelect>
                    </Box>
                </Box>

                <Box sx={inputFieldContainerSx}>
                    <Typography variant="subtitle2" fontWeight="700">
                        گروه:
                    </Typography>
                    <RHFMultiSelect
                        sx={{
                            ...textFieldCommonSx,
                            "& .MuiInputBase-root": {
                                ...textFieldCommonSx["& .MuiInputBase-root"],
                                paddingY: "8px",
                            },
                        }}
                        fullWidth
                        name="group"
                        options={groupOptions.map((item) => ({
                            value: item.value,
                            label: item.caption,
                        }))}
                    />
                </Box>
            </Box>

            <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                className={"px-3"}
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
                    disabled={isSubmitting || !isValid}
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
                </Button>
                <Button
                    disabled={isSubmitting}
                    type="button"
                    fullWidth
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
                        "&.Mui-disabled": {
                            borderColor: "#d9d9d9",
                            color: "#b0b0b0",
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