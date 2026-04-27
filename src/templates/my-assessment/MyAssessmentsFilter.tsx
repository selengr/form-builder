"use client";

import React from "react";
import {
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    Button,
} from "@mui/material";
import Image from "next/image";
import FilterIcon from '@/../public/images/home-page/filter-icon.svg';

type FilterValue =
    | "ALL"
    | "COMPETITION"
    | "QUESTION"
    | "SURVEY"
    | "TEST"
    | "PUBLIC"
    | "PRIVATE"
    | "only_answered"
    | "not_answered"
    | "show"
    | "not_show";

export type FormTypeFilter = {
    type: "ALL" | "COMPETITION" | "QUESTION" | "SURVEY" | "TEST";
    status: "ALL" | "PUBLIC" | "PRIVATE";
    takeParts: "ALL" | "only_answered" | "not_answered";
    showReport: "ALL" | "show" | "not_show";
};

type Props = {
    formType: FormTypeFilter;
    setFormType: React.Dispatch<React.SetStateAction<FormTypeFilter>>;
    onApply: () => void;
    onReset: () => void;
};

export default function MyAssessmentsFilter({
    formType,
    setFormType,
    onApply,
    onReset,
}: Props) {
    const handleChange =
        (key: keyof FormTypeFilter) =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                setFormType((prev) => ({
                    ...prev,
                    [key]: event.target.value as FilterValue,
                }));
            };

    return (
        <div className='flex h-[calc(100vh-60px)] w-full flex-col items-center justify-between'>
            <div className='w-full h-[52px] flex items-center justify-center gap-4 rounded-lg bg-[#F7F7FF] px-2 mb-4'>
                <div className='flex items-center w-full justify-center gap-2'>
                    <Image src={FilterIcon} width={30} height={30} alt='filter' />
                    <p className='text-[16px] text-center font-bold text-[#161616]'>فیلتر</p>
                </div>
            </div>
            <div className='flex flex-col gap-4 w-full overflow-y-auto h-full'>
                <div className='flex flex-col gap-4'>
                    <div className='w-full flex flex-col justify-center gap-4 rounded-[20px] bg-[#F7F7FF] px-4 pt-4 pb-3'>
                        <FormControl
                            sx={{
                                '& .MuiTypography-root': {
                                    fontSize: '14px',
                                    color: '#393939',
                                    fontWeight: 400,
                                },
                            }}>
                            <FormLabel
                                sx={{
                                    fontSize: '15px',
                                    color: '#161616',
                                    fontWeight: 700,
                                    mb: '8px',
                                    '&.Mui-focused': {
                                        color: '#161616',
                                    },
                                }}
                                id='demo-controlled-radio-buttons-group'>
                                بر اساس نوع
                            </FormLabel>
                            <RadioGroup aria-labelledby='demo-controlled-radio-buttons-group' name='controlled-radio-buttons-group' value={formType.type} onChange={handleChange("type")}>
                                <FormControlLabel value='ALL' control={<Radio />} label='همه' />
                                <FormControlLabel value='COMPETITION' control={<Radio />} label='مسابقه' />
                                <FormControlLabel value='QUESTION' control={<Radio />} label='پرسشنامه' />
                                <FormControlLabel value='SURVEY' control={<Radio />} label='نظرسنجی' />
                                <FormControlLabel value='TEST' control={<Radio />} label='آزمون' />
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <div className='w-full flex flex-col justify-center gap-4 rounded-[20px] bg-[#F7F7FF] px-4 pt-4 pb-3'>
                        <FormControl
                            sx={{
                                '& .MuiTypography-root': {
                                    fontSize: '14px',
                                    color: '#393939',
                                    fontWeight: 400,
                                },
                            }}>
                            <FormLabel
                                sx={{
                                    fontSize: '15px',
                                    color: '#161616',
                                    fontWeight: 700,
                                    mb: '8px',
                                    '&.Mui-focused': {
                                        color: '#161616',
                                    },
                                }}
                                id='demo-controlled-radio-buttons-group'>
                                بر اساس دسترسی
                            </FormLabel>
                            <RadioGroup aria-labelledby='demo-controlled-radio-buttons-group' name='controlled-radio-buttons-group' value={formType.status} onChange={handleChange("status")}>
                                <FormControlLabel value='ALL' control={<Radio />} label='همه' />
                                <FormControlLabel value='PUBLIC' control={<Radio />} label='عمومی' />
                                <FormControlLabel value='PRIVATE' control={<Radio />} label='خصوصی' />
                            </RadioGroup>
                        </FormControl>
                    </div>


                    <div className='w-full flex flex-col justify-center gap-4 rounded-[20px] bg-[#F7F7FF] px-4 pt-4 pb-3'>
                        <FormControl
                            sx={{
                                '& .MuiTypography-root': { fontSize: '14px', color: '#393939', fontWeight: 400 },
                            }}>
                            <FormLabel
                                sx={{
                                    fontSize: '15px',
                                    color: '#161616',
                                    fontWeight: 700,
                                    mb: '8px',
                                    '&.Mui-focused': { color: '#161616' },
                                }}>
                                بر اساس گزارش
                            </FormLabel>

                            <RadioGroup value={formType.showReport} onChange={handleChange("showReport")}>
                                <FormControlLabel value='ALL' control={<Radio />} label='همه' />
                                <FormControlLabel value='show' control={<Radio />} label='دارای گزارش' />
                                <FormControlLabel value='not_show' control={<Radio />} label='بدون گزارش' />
                            </RadioGroup>
                        </FormControl>
                    </div>

                    <div className='w-full flex flex-col justify-center gap-4 rounded-[20px] bg-[#F7F7FF] px-4 pt-4 pb-3'>
                        <FormControl
                            sx={{
                                '& .MuiTypography-root': { fontSize: '14px', color: '#393939', fontWeight: 400 },
                            }}>
                            <FormLabel
                                sx={{
                                    fontSize: '15px',
                                    color: '#161616',
                                    fontWeight: 700,
                                    mb: '8px',
                                    '&.Mui-focused': { color: '#161616' },
                                }}>
                                بر اساس وضعیت
                            </FormLabel>

                            <RadioGroup value={formType.takeParts} onChange={handleChange("takeParts")}>
                                <FormControlLabel value='ALL' control={<Radio />} label='همه' />
                                <FormControlLabel value='only_answered' control={<Radio />} label='انجام شده' />
                                <FormControlLabel value='not_answered' control={<Radio />} label='انجام نشده' />
                            </RadioGroup>
                        </FormControl>
                    </div>
                </div>
            </div>
            <div className='flex gap-4 items-center justify-between w-full mt-8'>
                <Button
                    sx={{
                        height: '52px',
                        bgcolor: '#1758BA',
                        boxShadow: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: 700,
                        '&.MuiButtonBase-root:hover, &.MuiButtonBase-root:active': {
                            bgcolor: '#1758BA',
                            boxShadow: 'none',
                        },
                    }}
                    fullWidth
                    variant='contained'
                    onClick={onApply}>
                    اعمال فیلتر
                </Button>
                <Button
                    sx={{
                        height: '52px',
                        bgcolor: 'white',
                        border: '1px solid #1758BA',
                        boxShadow: 'none',
                        borderRadius: '8px',
                        color: '#1758BA',
                        fontSize: '14px',
                        fontWeight: 700,
                        '&.MuiButtonBase-root:hover, &.MuiButtonBase-root:active': {
                            bgcolor: 'transparent',
                            boxShadow: 'none',
                        },
                    }}
                    fullWidth
                    variant='outlined'
                    onClick={onReset}>
                    حذف فیلتر
                </Button>
            </div>
        </div>
    );
}