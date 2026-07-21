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

interface PackagingFilterProps {
  mode: UnifiedListGridFilterMode;
  filter: SearchQueryFilter;
  onChange: React.Dispatch<React.SetStateAction<SearchQueryFilter>>;
  onApply: () => void;
  onReset: () => void;
}

export default function PackagingFilter({
  mode,
  filter,
  onChange,
  onApply,
  onReset,
}: PackagingFilterProps) {
  const isMobile = mode === 'mobile';

  return (
    <div
      className={`flex w-full flex-col items-center justify-between ${
        isMobile ? 'max-h-[70vh]' : 'h-[calc(100vh-60px)]'
      }`}>
      <div className="w-full h-[52px] flex items-center justify-center gap-4 rounded-lg bg-[#F7F7FF] px-2 mb-4 shrink-0">
        <Image src={FilterIcon} width={30} height={30} alt="filter" draggable={false} />
        <p className="text-[16px] text-center font-bold text-[#161616]">فیلتر</p>
      </div>

      <div className="flex flex-col gap-4 w-full overflow-y-auto flex-1 min-h-0">
        <div className="w-full bg-[#F7F7FF] rounded-[20px] px-4 pt-4 pb-3">
          <FormControl>
            <FormLabel sx={{ fontSize: 15, fontWeight: 700 }}>بر اساس گزارش</FormLabel>
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

        <div className="w-full bg-[#F7F7FF] rounded-[20px] px-4 pt-4 pb-3">
          <FormControl>
            <FormLabel sx={{ fontSize: 15, fontWeight: 700 }}>بر اساس زمان</FormLabel>
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

      <div className="flex gap-4 w-full mt-8 shrink-0">
        <Button
          type="button"
          fullWidth
          variant="contained"
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
          onClick={onApply}>
          اعمال فیلتر
        </Button>
        <Button
          type="button"
          fullWidth
          variant="outlined"
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
          onClick={onReset}>
          حذف فیلتر
        </Button>
      </div>
    </div>
  );
}
