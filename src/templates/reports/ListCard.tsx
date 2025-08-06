'use client';

import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { Button } from '@mui/material';
import { InfoRow } from '@/components/common/infoRow';

const formTypePersian: Record<string, string> = {
  TEST: 'آزمون',
  QUESTION: 'پرسشنامه',
  SURVEY: 'نظرسنجی',
  COMPETITION: 'مسابقه',
};

interface ListCardProps {
  data: {
    id: string;
    name: string;
    type: keyof typeof formTypePersian;
    accessType?: string;
    status?: string;
  };
}

const ActionButton: FC<{
  label: string;
  onClick: () => void;
  color: string;
  hoverColor?: string;
}> = ({ label, onClick, color, hoverColor }) => (
  <Button
    variant='contained'
    size='large'
    disableElevation
    fullWidth
    onClick={onClick}
    title={label}
    sx={{
      backgroundColor: color,
      borderRadius: '8px',
      '&:hover': {
        backgroundColor: hoverColor || color,
        opacity: hoverColor ? 1 : 0.9,
      },
    }}>
    {label}
  </Button>
);

const ListCard: FC<ListCardProps> = ({ data }) => {
  const router = useRouter();
  const { id, name, type, accessType } = data;

  return (
    <div className='flex flex-col gap-4 rounded-2xl border border-[#DDE1E6] p-5 shadow-sm'>
      <InfoRow label='نام' value={name} bold />
      <InfoRow label='نوع' value={formTypePersian[type]} bold />
      <InfoRow label='دسترسی' value={accessType || 'عمومی'} bold />

      <div className='flex flex-col gap-2 sm:flex-row'>
        <ActionButton label='مشاهده نتایج' onClick={() => router.push(`/stats/${id}`)} color='#1758BA' hoverColor='#216ee1' />
        <ActionButton label='ساخت گزارش' onClick={() => router.push(`/reports/create-solo/${id}`)} color='#2CDFC9' />
      </div>
    </div>
  );
};

export default ListCard;
