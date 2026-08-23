'use client';

import Link from 'next/link';
import Image from 'next/image';
import { IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { InfoRow } from '@/components/common/infoRow';
import { SwitchButton } from '@/components/Switch/SwitchButton';
import { UnifiedListGridCardProps } from '@/components/unified-list-grid';
import ShareLinkModal from './ShareLinkModal';
import CopyIcon from '@/../public/images/home-page/copy.svg';
import EditIcon from '@/../public/images/home-page/edit-2.svg';
import TrashIcon from '@/../public/images/home-page/trash.svg';
import { CodiconEye } from '@/../public/images/home-page/EyeIcon';
import { SurveyListItem } from './types';

export default function SurveyListCard({
  data,
}: UnifiedListGridCardProps<SurveyListItem>) {
  const router = useRouter();
  const [loading] = useState(false);
  const [, setOpenConfirmDialog] = useState(false);

  const handleNavigation = () => {
    localStorage.setItem('stats', '/survey');
    router.push(`/stats/${data.id}`);
  };

  const handlePreview = () => {
    if (!data.id) return;
    const params = new URLSearchParams({
      from: 'TESTING',
    });
    router.push(`form/${data.id}?${params.toString()}`);
  };

  return (
    <div className="border p-4 rounded-2xl border-[#DDE1E6] flex flex-col gap-3 w-full max-w-full relative">
      <InfoRow label="نام" value={data.name} bold />
      <SwitchButton
        sx={{ position: 'absolute', top: 15, right: 15 }}
        checked={!data.showReportForResponder}
        onChange={() => console.log('object')}
      />
      <InfoRow label="سرویس‌گیرنده" value={data.surveyTargetPlatformEnum} bold />
      <InfoRow
        label="وضعیت"
        value={data?.status === 'CREATE' ? 'ایجاد شده' : 'نهایی'}
        bold
      />

      <div className="flex flex-wrap gap-2 w-full justify-between">
        <button
          className="bg-[#1758BA] max-w-40 hover:bg-[#216ee1] transition-all duration-200 px-3 h-[42px] text-sm rounded-lg text-white grow sm:grow md:flex-1"
          onClick={handlePreview}>
          پیش نمایش
        </button>

        <div className="flex gap-2 flex-wrap items-center justify-start">
          <IconButton
            onClick={() => setOpenConfirmDialog(true)}
            disabled={loading}
            color="error">
            <Image src={TrashIcon} alt="delete" width={24} height={24} />
          </IconButton>

          <IconButton disabled={loading}>
            <Image src={CopyIcon} alt="copy" width={24} height={24} />
          </IconButton>

          {data.status === 'CREATE' && (
            <Link href={`/builder/${data.id}?admin=survey`}>
              <IconButton disabled={loading} color="primary">
                <Image src={EditIcon} alt="edit" width={24} height={24} />
              </IconButton>
            </Link>
          )}
          {data.status === 'PUBLISH' && <ShareLinkModal formData={data} />}
          {data.status === 'PUBLISH' && (
            <div onClick={handleNavigation}>
              <IconButton disabled={loading} color="primary">
                <CodiconEye />
              </IconButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
