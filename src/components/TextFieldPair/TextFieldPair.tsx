"use client";

import {useState} from "react";
import Typography from "@mui/material/Typography";
import {ITextFieldFormPatternOptions} from "@/types/bulider";
import {RHFMultiSelect, RHFTextField} from "../hook-form";

const fieldPatternOptions: ITextFieldFormPatternOptions = [
  { value: "SHORT_TEXT", label: "متن ساده" },
  { value: "LONG_TEXT", label: "متن بلند" },
  { value: "NUMBER", label: "عددی" },
  { value: "NATIONAL_CODE", label: "کدملی" },
  { value: "DATE", label: "تاریخ" },
  // { value: "TIME", label: "زمان" },
  { value: "PHONE", label: "تلفن" },
];

export default function TextFieldPair({
  setValue,
  clearErrors,
  initialShow,
}: any) {
  const [showMinMaxProps, setShowMinMaxProps] = useState(initialShow);

  return (
    <>
      <div className="flex flex-col gap-2 mt-5">
        <Typography variant="subtitle2" fontWeight="700">
          الگوی فیلد پاسخ:
        </Typography>
        <RHFMultiSelect
          name="TEXT_FIELD_PATTERN.value"
          options={fieldPatternOptions}
          setProp={setShowMinMaxProps}
          clearErros={clearErrors}
          setValue={setValue}
        />
      </div>

      {showMinMaxProps ? (
        <div className="flex gap-4 mt-4 justify-between">
          <div className="w-full">
            <Typography variant="subtitle2" fontWeight="700">
              حداقل کاراکتر:
            </Typography>
            <RHFTextField name="MINIMUM_LEN.value" type="number" />
          </div>
          <div className="w-full">
            <Typography variant="subtitle2" fontWeight="700">
              حداکثر کاراکتر:
            </Typography>
            <RHFTextField name="MAXIMUM_LEN.value" type="number" />
          </div>
        </div>
      ) : null}
    </>
  );
}
