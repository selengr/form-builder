"use client";

import {useEffect, useState} from "react";
import DatePickerSearch from "react-multi-date-picker";
import persian_fa from "react-date-object/locales/persian_fa";
import persian from "react-date-object/calendars/persian";

export function formatDate(date: any) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}/${month}/${day}`;
}

interface Props {
  onChange: (value: string) => void;
  error?: boolean;
  value?: string;
  min?: any;
  max?: any;
  inputClass?: any;
  disabled?: boolean;
}

const parseDateString = (dateString: string): any => {
  const date = new Date(dateString);
  return formatDate(new Date(date));
};

export function DatePicker({
  onChange,
  error,
  value,
  min,
  max,
  inputClass,
  disabled = false,
}: Props) {
  const [selectedDay, setSelectedDay] = useState<any>(
    value ? parseDateString(value) : null
  );

  useEffect(() => {
    if (selectedDay?.year) {
      const formattedDate = formatDate(
        new Date(selectedDay.year, selectedDay.month - 1, selectedDay.day)
      );
      onChange(formattedDate as any);
    }
  }, [selectedDay]);

  useEffect(() => {
    if (disabled) {
      setSelectedDay(null);
    }
  }, [disabled]);

  return (
    <div className="w-full">
      <DatePickerSearch
        disabled={disabled}
        minDate={min}
        maxDate={max}
        onChange={setSelectedDay}
        containerClassName="w-full"
        zIndex={9999}
        inputClass={`${
          error
            ? "border-[#f87171] shadow-[0_0_0_4px_#E11D2B33]"
            : "border-neutral-300"
        } ${
          inputClass
            ? inputClass
            : "h-[55px] max-w-[500px] w-full px-4 border-[1px] rounded-[10px] text-center font-bold p-1"
        }`}
        value={selectedDay}
        calendar={persian}
        locale={persian_fa}
        highlightToday={false}
        portal
      />
    </div>
  );
}
