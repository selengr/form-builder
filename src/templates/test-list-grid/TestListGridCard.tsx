'use client';

import { Button } from '@mui/material';
import { InfoRow } from '@/components/common/infoRow';
import { UnifiedListGridCardProps } from '@/components/unified-list-grid';
import { TestListGridItem } from '@/app/api/test-list-grid/data';

export default function TestListGridCard({
  data,
  refreshGrid,
}: UnifiedListGridCardProps<TestListGridItem>) {
  const typeLabels: Record<TestListGridItem['type'], string> = {
    QUESTION: 'پرسشنامه',
    TEST: 'آزمون',
    COMPETITION: 'مسابقه',
  };

  const statusLabels: Record<TestListGridItem['status'], string> = {
    ACTIVE: 'فعال',
    DRAFT: 'پیش‌نویس',
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#DDE1E6] p-5 shadow-sm">
      <InfoRow label="نام" value={data.name} bold />
      <InfoRow label="نوع" value={typeLabels[data.type]} bold />
      <InfoRow label="وضعیت" value={statusLabels[data.status]} bold />
      <InfoRow label="توضیحات" value={data.description} bold />
      <Button
        variant="contained"
        disableElevation
        fullWidth
        onClick={() => refreshGrid?.()}
        sx={{
          backgroundColor: '#1758BA',
          borderRadius: '8px',
          '&:hover': { backgroundColor: '#216ee1' },
        }}>
        بروزرسانی لیست (تست)
      </Button>
    </div>
  );
}
