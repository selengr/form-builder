'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { Radio } from '@mui/material';
import { WeuiDeleteOutlined } from '../../../public/images/icons/DeleteIcon';

interface SubConditionDividerProps {
  conditionIndex: number;
  subIndex: number;
  onRemove: () => void;
}

export function DottedLineWithDots() {
  return (
    <div className="flex flex-1 items-center min-w-0 mx-1">
      <span className="shrink-0 w-[6px] h-[6px] rounded-full bg-[#DDE1E6]" />

      <div
        className="flex-1 min-w-[24px] h-[1px] mx-1"
        style={{
          background: `repeating-linear-gradient(
            to right,
            #DDE1E6 0px,
            #DDE1E6 8px,
            transparent 8px,
            transparent 14px
          )`,
        }}
      />

      <span className="shrink-0 w-[6px] h-[6px] rounded-full bg-[#DDE1E6]" />
    </div>
  );
}

export default function SubConditionDivider({
  conditionIndex,
  subIndex,
  onRemove,
}: SubConditionDividerProps) {
  const { control } = useFormContext();
  const fieldName = `conditions.${conditionIndex}.subConditions.${subIndex}.logicalOperator`;

  return (
    <div dir="ltr" className="flex items-center gap-2 w-full py-1 px-[14px]">
      <button
        type="button"
        onClick={onRemove}
        aria-label="حذف شرط"
        className="shrink-0 w-[36px] h-[36px] rounded-xl border border-[#FA4D56] bg-[#FA4D560D] flex items-center justify-center hover:bg-[#FA4D561A] transition-colors"
      >
        <WeuiDeleteOutlined className="text-[#FA4D56]" fontSize="1.3rem" />
      </button>

      <DottedLineWithDots />

      <Controller
        name={fieldName}
        control={control}
        defaultValue="&&"
        render={({ field }) => (
          <div className="flex items-center gap-4 shrink-0">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <span
                className={`text-[14px] font-semibold ${
                  field.value === '||' ? 'text-[#FA4D56]' : 'text-[#FA4D56]/70'
                }`}
              >
                یا
              </span>
              <Radio
                checked={field.value === '||'}
                onChange={() => field.onChange('||')}
                value="||"
                size="small"
                sx={{
                  p: 0.25,
                  color: '#DDE1E6',
                  '&.Mui-checked': { color: '#1758BA' },
                }}
              />
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <span
                className={`text-[14px] font-semibold ${
                  field.value === '&&' ? 'text-[#9333EA]' : 'text-[#9333EA]/70'
                }`}
              >
                و
              </span>
              <Radio
                checked={field.value === '&&' || !field.value}
                onChange={() => field.onChange('&&')}
                value="&&"
                size="small"
                sx={{
                  p: 0.25,
                  color: '#DDE1E6',
                  '&.Mui-checked': { color: '#1758BA' },
                }}
              />
            </label>
          </div>
        )}
      />
    </div>
  );
}
