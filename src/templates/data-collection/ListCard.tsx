'use client';

import Link from 'next/link';
import Image from 'next/image';
import { IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import { InfoRow } from '@/components/common/infoRow';
import { UnifiedListGridCardProps } from '@/components/unified-list-grid';
import EditIcon from '@/../public/images/home-page/edit-2.svg';
import { CodiconEye } from '@/../public/images/home-page/EyeIcon';
import { DataCollectionListItem } from './types';

const statusMap: Record<string, string> = {
  CREATE: 'فعال',
  FINAL: 'نهایی',
};

export default function DataCollectionListCard({
  data,
}: UnifiedListGridCardProps<DataCollectionListItem>) {
  const router = useRouter();

  const handleNavigation = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('stats', '/data-collection');
      } catch {}
    }
    router.push(`/data-collection/${data.id}?name=${data.name}`);
  };

  const handlePreview = () => {
    if (!data.id) return;
    const params = new URLSearchParams({
      from: 'TESTING',
    });
    if (data.status === 'CREATE') {
      router.push(`/preview/${data.id}?rep=list&from=data-collection`);
    } else {
      router.push(`form/${data.id}?${params.toString()}`);
    }
  };

  return (
    <div className="border p-4 rounded-2xl border-[#DDE1E6] flex flex-col gap-3 w-full max-w-full relative">
      <InfoRow label="نام" value={data.name} bold />
      <InfoRow label="سرویس‌گیرنده" value={data?.surveyTargetPlatformEnum} bold />
      <InfoRow label="وضعیت" value={statusMap[data?.status]} bold />

      <div className="flex flex-wrap gap-2 w-full justify-between">
        <button
          className="bg-[#1758BA] hover:bg-[#216ee1] transition-all duration-200 px-12 h-[42px] text-sm rounded-lg text-white"
          onClick={handlePreview}>
          {data.status === 'CREATE' ? 'مشاهده' : 'پیش نمایش'}
        </button>

        <ActionButtons id={data.id} onViewList={handleNavigation} />
      </div>
    </div>
  );
}

type TActionButtonsProps = {
  id: number;
  onViewList: () => void;
};

const ActionButtons: React.FC<TActionButtonsProps> = ({ id, onViewList }) => {
  return (
    <div className="flex gap-2 flex-wrap items-center justify-end">
      <Link href={`/builder/${id}?admin=data-collection`}>
        <IconButton color="primary">
          <Image src={EditIcon} alt="edit" width={24} height={24} />
        </IconButton>
      </Link>

      <IconButton color="primary" onClick={onViewList}>
        <CodiconEye />
      </IconButton>
    </div>
  );
};
