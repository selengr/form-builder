"use client";
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Button } from "@mui/material";
import Image from "next/image";
import FilterIcon from "@/../public/images/home-page/filter-icon.svg";
import React from "react";

type FormType = {
  type: string;
  status: string;
};

interface FormFilterProps {
  formType: FormType;
  setFormType: (value: FormType) => void;
  onApply: () => void;
  onReset: () => void;
}

const FormFilter = ({ formType, setFormType, onApply, onReset }: FormFilterProps) => {
  const handleChange = (field: "type" | "status") => (e: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    setFormType(prev => ({ ...prev, [field]: e.target.value }));
  };
  const FilterHeader = React.useMemo(() => (
    <div className="w-full h-[52px] flex items-center justify-center gap-4 rounded-lg bg-[#F7F7FF] px-2 mb-4">
      <Image src={FilterIcon} width={30} height={30} alt="filter" loading="eager" priority={true} />
      <p className="text-[16px] text-center font-bold text-[#161616]">فیلتر</p>
    </div>
  ), []);
  const renderRadioGroup = (
    label: string,
    field: "type" | "status",
    options: { label: string; value: string }[]
  ) => (
    <div className="w-full flex flex-col justify-center gap-4 rounded-[20px] bg-[#F7F7FF] px-4 pt-4 pb-3">
      <FormControl
        sx={{
          "& .MuiTypography-root": {
            fontSize: "14px",
            color: "#393939",
            fontWeight: 400,
          },
        }}
      >
        <FormLabel
          sx={{
            fontSize: "15px",
            color: "#161616",
            fontWeight: 700,
            mb: "8px",
          }}
        >
          {label}
        </FormLabel>
        <RadioGroup value={formType[field]} onChange={handleChange(field)}>
          {options.map(({ value, label }) => (
            <FormControlLabel key={value} value={value} control={<Radio />} label={label} />
          ))}
        </RadioGroup>
      </FormControl>
    </div>
  );

  return (
    <div className="flex h-full w-full flex-col items-center justify-between">
      {FilterHeader}
      <div className="flex flex-col gap-4 w-full">
        {renderRadioGroup("بر اساس نوع", "type", [
          { value: "ALL", label: "همه" },
          { value: "COMPETITION", label: "مسابقه" },
          { value: "QUESTION", label: "پرسشنامه" },
          { value: "SURVEY", label: "نظرسنجی" },
          { value: "TEST", label: "آزمون" },
        ])}
        {renderRadioGroup("بر اساس دسترسی", "status", [
          { value: "ALL", label: "همه" },
          { value: "PUBLIC", label: "عمومی" },
          { value: "PRIVATE", label: "خصوصی" },
        ])}
      </div>

      <div className="flex gap-4 items-center justify-between w-full mt-8">
        <Button
          fullWidth
          variant="contained"
          onClick={onApply}
          sx={{
            height: "52px",
            bgcolor: "#1758BA",
            color: "white",
            fontWeight: 700,
            borderRadius: "8px",
            "&:hover": { bgcolor: "#1758BA" },
          }}
        >
          اعمال فیلتر
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={onReset}
          sx={{
            height: "52px",
            border: "1px solid #1758BA",
            color: "#1758BA",
            fontWeight: 700,
            borderRadius: "8px",
          }}
        >
          حذف فیلتر
        </Button>
      </div>
    </div>
  );
};

export default FormFilter;
