'use client';

import Image from 'next/image';
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import FilterIcon from '@/../public/images/home-page/filter-icon.svg';
import { SearchQueryFilter, UnifiedListGridFilterMode } from '@/components/unified-list-grid';
import { PackagingRequestStatus, packagingRequestStatusLabels } from './constants';

interface PackagingRequestFilterProps {
  mode: UnifiedListGridFilterMode;
  filter: SearchQueryFilter;
  onChange: React.Dispatch<React.SetStateAction<SearchQueryFilter>>;
  onApply: () => void;
  onReset: () => void;
}

const STATUS_OPTIONS: Array<{ value: 'ALL' | PackagingRequestStatus; label: string }> = [
  { value: 'ALL', label: 'همه' },
  ...(
    Object.entries(packagingRequestStatusLabels) as Array<
      [PackagingRequestStatus, string]
    >
  ).map(([value, label]) => ({ value, label })),
];

export default function PackagingRequestFilter({
  mode,
  filter,
  onChange,
  onApply,
  onReset,
}: PackagingRequestFilterProps) {
  const isMobile = mode === 'mobile';

  return (
    <div
      className={`flex w-full flex-col overflow-y-hidden ${
        isMobile ? 'max-h-[70vh]' : 'h-[calc(100vh-50px)]'
      }`}>
      <div className="w-full h-[52px] flex items-center justify-center gap-4 rounded-lg bg-[#F7F7FF] px-2 mb-4 shrink-0">
        <div className="flex items-center w-full justify-center gap-2">
          <Image src={FilterIcon} width={30} height={30} alt="filter" draggable={false} unoptimized/>
          <p className="text-[16px] text-center font-bold text-[#161616]">فیلتر</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-4 min-h-0" style={{ scrollbarWidth: 'thin' }}>
        <div className="w-full flex flex-col justify-center gap-4 rounded-[20px] bg-[#F7F7FF] px-4 pt-4 pb-3">
          <FormControl>
            <FormLabel sx={{ fontSize: '15px', color: '#161616', fontWeight: 700, mb: '8px' }}>
              بر اساس وضعیت
            </FormLabel>
            <RadioGroup
              value={filter.status ?? 'ALL'}
              onChange={(event) =>
                onChange((prev) => ({ ...prev, status: event.target.value }))
              }>
              {STATUS_OPTIONS.map(({ value, label }) => (
                <FormControlLabel
                  key={value}
                  value={value}
                  control={<Radio />}
                  label={label}
                />
              ))}
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
