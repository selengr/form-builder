'use client';

import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { Button } from '@mui/material';
// components
import { InfoRow } from '@/components/common/infoRow';
// constants
import { formTypePersian } from '@/constants/formDictionaries';
interface ListCardProps {
  data: {
    id: string;
    name: string;
    type: keyof typeof formTypePersian;
    accessType?: string;
    status?: string;
    isCreatedSoloReport: boolean
  };
}

export const ActionButton: FC<{
  label: string;
  onClick: () => void;
  color: string;
  hoverColor?: string;
}> = ({ label, onClick, color, hoverColor }) => (
  <Button
    variant='contained'
    // size='large'
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

  const handleNavigation = () => {
    localStorage.setItem("stats", "/reports")
    router.push(`/stats/${id}?name=${name}`)
  }

  const isPackaging = type === "PACKAGING";
  return (

    <div
      className={`flex flex-col gap-3 rounded-2xl border p-5 shadow-sm relative ${isPackaging ? "border-amber-300" : "border-[#DDE1E6]"
        }`}
    >
  
      <InfoRow label='نام' value={name} bold />
      <InfoRow label='نوع' value={formTypePersian[type]} bold />
      <InfoRow label='دسترسی' value={accessType || 'عمومی'} bold />

      <div className="flex flex-row gap-3">
        <ActionButton
          label="مشاهده نتایج"
          onClick={handleNavigation}
          color="#1758BA"
          hoverColor="#216ee1"
        />
        {!isPackaging && (
          <ActionButton
            label={data.isCreatedSoloReport ? 'ویرایش گزارش' : 'ساخت گزارش'}
            onClick={() => router.push(`/reports/create-solo/${id}`)}
            color="#2CDFC9"
            hoverColor="#26cbb7"
          />)}
      </div>
    </div>

  );
};

export default ListCard;
