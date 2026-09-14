'use client';

import Image from 'next/image';
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import FilterIcon from '@/../public/images/home-page/filter-icon.svg';
import { SearchQueryFilter, UnifiedListGridFilterMode } from '@/components/unified-list-grid';

interface MyAssessmentsFilterProps {
  mode: UnifiedListGridFilterMode;
  filter: SearchQueryFilter;
  onChange: React.Dispatch<React.SetStateAction<SearchQueryFilter>>;
  onApply: () => void;
  onReset: () => void;
}

export default function MyAssessmentsFilter({
  mode,
  filter,
  onChange,
  onApply,
  onReset,
}: MyAssessmentsFilterProps) {
  const isMobile = mode === 'mobile';

  const handleChange =
    (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange((prev) => ({
        ...prev,
        [key]: event.target.value,
      }));
    };

  return (
    <div
      className={`flex w-full flex-col overflow-y-hidden ${
        isMobile ? 'max-h-[70vh]' : 'h-[calc(100vh-50px)]'
      }`}>
      <div className="w-full h-[52px] flex items-center justify-center gap-4 rounded-lg bg-[#F7F7FF] px-2 mb-4 shrink-0">
        <div className="flex items-center w-full justify-center gap-2">
          <Image src={FilterIcon} width={30} height={30} alt="filter" unoptimized />
          <p className="text-[16px] text-center font-bold text-[#161616]">فیلتر</p>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto pb-4 min-h-0 flex flex-col gap-4"
        style={{ scrollbarWidth: 'thin' }}>
        <div className="w-full flex flex-col justify-center gap-4 rounded-[20px] bg-[#F7F7FF] px-4 pt-4 pb-3">
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
                '&.Mui-focused': { color: '#161616' },
              }}>
              بر اساس نوع
            </FormLabel>
            <RadioGroup value={filter.type ?? 'ALL'} onChange={handleChange('type')}>
              <FormControlLabel value="ALL" control={<Radio />} label="همه" />
              <FormControlLabel value="COMPETITION" control={<Radio />} label="مسابقه" />
              <FormControlLabel value="QUESTION" control={<Radio />} label="پرسشنامه" />
              <FormControlLabel value="SURVEY" control={<Radio />} label="نظرسنجی" />
              <FormControlLabel value="TEST" control={<Radio />} label="آزمون" />
            </RadioGroup>
          </FormControl>
        </div>

        <div className="w-full flex flex-col justify-center gap-4 rounded-[20px] bg-[#F7F7FF] px-4 pt-4 pb-3">
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
                '&.Mui-focused': { color: '#161616' },
              }}>
              بر اساس گزارش
            </FormLabel>
            <RadioGroup
              value={filter.showReport ?? 'ALL'}
              onChange={handleChange('showReport')}>
              <FormControlLabel value="ALL" control={<Radio />} label="همه" />
              <FormControlLabel value="show" control={<Radio />} label="دارای گزارش" />
              <FormControlLabel value="not_show" control={<Radio />} label="بدون گزارش" />
            </RadioGroup>
          </FormControl>
        </div>

        <div className="w-full flex flex-col justify-center gap-2 rounded-[20px] bg-[#F7F7FF] px-4 pt-3 pb-2">
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
                mb: '6px',
                '&.Mui-focused': { color: '#161616' },
              }}>
              بر اساس وضعیت
            </FormLabel>
            <RadioGroup
              value={filter.takeParts ?? 'ALL'}
              onChange={handleChange('takeParts')}>
              <FormControlLabel value="ALL" control={<Radio />} label="همه" />
              <FormControlLabel
                value="only_answered"
                control={<Radio />}
                label="انجام شده"
              />
              <FormControlLabel
                value="not_answered"
                control={<Radio />}
                label="انجام نشده"
              />
            </RadioGroup>
          </FormControl>
        </div>
      </div>

      <div className="flex gap-4 items-center justify-between w-full mt-4 shrink-0">
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
          variant="contained"
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
          variant="outlined"
          onClick={onReset}>
          حذف فیلتر
        </Button>
      </div>
    </div>
  );
}
