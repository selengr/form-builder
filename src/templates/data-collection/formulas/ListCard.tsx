'use client';

import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import { IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import { InfoRow } from '@/components/common/infoRow';
import { SwitchButton } from '@/components/Switch/SwitchButton';
import { UnifiedListGridCardProps } from '@/components/unified-list-grid';
import EditIcon from '@/../public/images/home-page/edit-2.svg';
import TrashIcon from '@/../public/images/home-page/trash.svg';
import { useGetFormulaTargetPlatform } from './hooks/useGetFormulaTargetPlatform';
import { MajorFormulaListItem } from './types';

export default function FormulaListCard({
  data,
}: UnifiedListGridCardProps<MajorFormulaListItem>) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(true);
  const { TargetPlatform } = useGetFormulaTargetPlatform(true);

  const platformCaption =
    TargetPlatform?.find((item) => item.value === data.targetPlatformEnum)?.caption ??
    data.targetPlatformEnum;

  const handleEdit = () => {
    router.push(`/data-collection/formulas/${data.id}?name=${encodeURIComponent(data.majorName)}`);
  };

  const handleView = () => {
    router.push(`/data-collection/formulas/${data.id}?name=${encodeURIComponent(data.majorName)}`);
  };

  const handleDelete = () => {
    toast.info('این قابلیت به‌زودی اضافه می‌شود');
  };

  const handleValidate = () => {
    toast.info('این قابلیت به‌زودی اضافه می‌شود');
  };

  return (
    <div className="border p-4 rounded-2xl border-[#DDE1E6] flex flex-col gap-3 w-full max-w-full relative">
      {/* <SwitchButton
        sx={{ position: 'absolute', top: 15, right: 15 }}
        checked={enabled}
        onChange={(event) => setEnabled(event.target.checked)}
      /> */}

      <InfoRow label="نام فرمول" value={data.majorName} bold />
      <InfoRow label="سرویس‌گیرنده" value={platformCaption} bold />

      <div className="flex flex-wrap gap-2 w-full justify-between">
        <div className="flex gap-2 items-center flex-wrap">
          <button
            className="bg-[#1758BA] hover:bg-[#216ee1] transition-all duration-200 px-6 h-[42px] text-sm rounded-lg text-white"
            onClick={handleValidate}>
            صحت‌سنجی
          </button>
          <button
            className="border border-[#1758BA] text-[#1758BA] bg-white hover:bg-[#f3f7fd] transition-all duration-200 px-6 h-[42px] text-sm rounded-lg"
            onClick={handleView}>
            مشاهده
          </button>
        </div>

        <div className="flex gap-2 items-center justify-end">
          <IconButton color="primary" onClick={handleEdit}>
            <Image src={EditIcon} alt="edit" width={24} height={24} />
          </IconButton>
          {/* <IconButton color="error" onClick={handleDelete}>
            <Image src={TrashIcon} alt="delete" width={24} height={24} />
          </IconButton> */}
        </div>
      </div>
    </div>
  );
}
