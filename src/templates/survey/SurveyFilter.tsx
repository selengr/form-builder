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
import { useGetTargetPlatform } from './hooks/useGetTargetPlatform';

interface SurveyFilterProps {
  mode: UnifiedListGridFilterMode;
  filter: SearchQueryFilter;
  onChange: React.Dispatch<React.SetStateAction<SearchQueryFilter>>;
  onApply: () => void;
  onReset: () => void;
}

export default function SurveyFilter({
  mode,
  filter,
  onChange,
  onApply,
  onReset,
}: SurveyFilterProps) {
  const isMobile = mode === 'mobile';
  const { TargetPlatform, isFetchingTargetPlatform } = useGetTargetPlatform(true);

  return (
    <div
      className={`flex w-full flex-col overflow-y-hidden ${
        isMobile ? 'max-h-[70vh]' : 'h-[calc(100vh-50px)]'
      }`}>
      <div className="w-full h-[52px] flex items-center justify-center gap-4 rounded-lg bg-[#F7F7FF] px-2 mb-4 shrink-0">
        <div className="flex items-center w-full justify-center gap-2">
          <Image src={FilterIcon} width={30} height={30} alt="filter" draggable={false} />
          <p className="text-[16px] text-center font-bold text-[#161616]">فیلتر</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-4 min-h-0" style={{ scrollbarWidth: 'thin' }}>
        <div className="w-full bg-[#F7F7FF] rounded-[20px] px-4 pt-4 pb-3 mb-4">
          <FormControl>
            <FormLabel sx={{ fontSize: '15px', color: '#161616', fontWeight: 700, mb: '8px' }}>
              بر اساس گزارش
            </FormLabel>
            <RadioGroup
              value={filter.isCreatedSoloReport ?? 'ALL'}
              onChange={(event) =>
                onChange((prev) => ({ ...prev, isCreatedSoloReport: event.target.value }))
              }>
              <FormControlLabel value="ALL" control={<Radio />} label="همه" />
              <FormControlLabel value="true" control={<Radio />} label="دارای گزارش" />
              <FormControlLabel value="false" control={<Radio />} label="بدون گزارش" />
            </RadioGroup>
          </FormControl>
        </div>

        <div className="w-full bg-[#F7F7FF] rounded-[20px] px-4 pt-4 pb-3 mb-4">
          <FormControl>
            <FormLabel sx={{ fontSize: '15px', color: '#161616', fontWeight: 700, mb: '8px' }}>
              بر اساس سرویس‌گیرنده
            </FormLabel>
            <RadioGroup
              value={filter.surveyTargetPlatformEnum ?? 'ALL'}
              onChange={(event) =>
                onChange((prev) => ({
                  ...prev,
                  surveyTargetPlatformEnum: event.target.value,
                }))
              }>
              <FormControlLabel value="ALL" control={<Radio />} label="همه" />
              {isFetchingTargetPlatform && (
                <FormControlLabel value="ALL" control={<Radio />} label="loading..." />
              )}
              {TargetPlatform?.map((item) => (
                <FormControlLabel
                  key={item.value}
                  value={item.value}
                  control={<Radio />}
                  label={item.caption}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </div>

        <div className="w-full bg-[#F7F7FF] rounded-[20px] px-4 pt-4 pb-3">
          <FormControl>
            <FormLabel sx={{ fontSize: '15px', color: '#161616', fontWeight: 700, mb: '8px' }}>
              بر اساس زمان
            </FormLabel>
            <RadioGroup
              value={filter.fieldOperation ?? 'DSC'}
              onChange={(event) =>
                onChange((prev) => ({ ...prev, fieldOperation: event.target.value }))
              }>
              <FormControlLabel value="DSC" control={<Radio />} label="جدیدترین" />
              <FormControlLabel value="ASC" control={<Radio />} label="قدیمی‌ترین" />
            </RadioGroup>
          </FormControl>
        </div>
      </div>

      <div className="sticky bottom-0 bg-white pt-4 pb-2 shrink-0">
        <div className="flex gap-4 items-center justify-between w-full">
          <Button
            type="button"
            sx={{
              height: '52px',
              bgcolor: '#1758BA',
              boxShadow: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              fontWeight: 700,
              '&.MuiButtonBase-root:hover': { bgcolor: '#1758BA', boxShadow: 'none' },
            }}
            fullWidth
            variant="contained"
            onClick={onApply}>
            اعمال فیلتر
          </Button>
          <Button
            type="button"
            sx={{
              height: '52px',
              bgcolor: 'white',
              border: '1px solid #1758BA',
              boxShadow: 'none',
              borderRadius: '8px',
              color: '#1758BA',
              fontSize: '14px',
              fontWeight: 700,
              '&.MuiButtonBase-root:hover': { bgcolor: 'transparent', boxShadow: 'none' },
            }}
            fullWidth
            variant="outlined"
            onClick={onReset}>
            حذف فیلتر
          </Button>
        </div>
      </div>
    </div>
  );
}
