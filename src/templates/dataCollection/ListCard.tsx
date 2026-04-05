'use client';

import Link from 'next/link';
import Image from 'next/image';
import { IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
// components
import { InfoRow } from '@/components/common/infoRow';
import { SwitchButton } from '@/components/Switch/SwitchButton';
// types
import { ISurveyItem } from '@/types/survey';
// images
import CopyIcon from '@/../public/images/home-page/copy.svg';
import EditIcon from '@/../public/images/home-page/edit-2.svg';
import TrashIcon from '@/../public/images/home-page/trash.svg';
import { CodiconEye } from '../../../public/images/home-page/EyeIcon';

interface ListCardProps {
  data: ISurveyItem;
  buttonText: string;
  buttonLink?: string | ((id: string) => string);
  buttonDisabled?: boolean;
  showStatus?: boolean;
}

interface IExpireDate {
  day: string;
  month: string;
  year: string;
}

export interface ITakeParts {
  expireDate: IExpireDate;
  formName: string;
  takePartId: number;
}


const ListCard: React.FC<ListCardProps> = ({
  data,
  buttonText,
  buttonLink,
  buttonDisabled = false,
  showStatus = true,
}) => {

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);

  const handleClick = () => {
    if (!buttonLink) return;
    const href = typeof buttonLink === 'function' ? buttonLink(data.id as any) : buttonLink;
    router.push(href);
  };

  const handleCopy = useCallback(async () => {
      setOpenConfirmDialog((prev) => !prev)
  }, []);

  
  const handleNavigation = () => {
    localStorage.setItem("stats", "/data-collection")
    router.push(`/data-collection/${data.id}`)
  }

  return (
    <div className="border p-4 rounded-2xl border-[#DDE1E6] flex flex-col gap-3 w-full max-w-full relative">


      {/* اطلاعات فرم */}
      <InfoRow label="نام" value={data.name} bold />
        <SwitchButton
                sx={{ position: "absolute", top: 15, right: 15 }}
                checked={!data.showReportForResponder}
                onChange={() => console.log("object")}
              />
      <InfoRow label="سرویس‌گیرنده" value={data?.surveyTargetPlatformEnum} bold />
      {showStatus && (
        <InfoRow
          label="وضعیت"
          value={data?.status === "CREATE" ? 'ایجاد شده' : 'نهایی'}
          bold
        />
      )}

      <div className='flex flex-wrap gap-2 w-full'>
        <button
          className='bg-[#1758BA] hover:bg-[#216ee1] transition-all duration-200 px-3 h-[42px] text-sm rounded-lg text-white grow sm:grow md:flex-1'
          onClick={() => router.push(`/preview/${data.id}`)}>
          مشاهده
        </button>

        <div className='flex gap-2 flex-wrap items-center justify-end'>
          <IconButton onClick={() => setOpenConfirmDialog(true)} disabled={loading} color='error'>
            <Image src={TrashIcon} alt='delete' width={24} height={24} />
          </IconButton>

          <IconButton disabled={loading}>
            <Image src={CopyIcon} alt='copy' width={24} height={24} />
          </IconButton>

          {data.status === 'CREATE' && (
            <Link href={`/builder/${data.id}?admin=data-collection`}>
              <IconButton disabled={loading} color='primary'>
                <Image src={EditIcon} alt='edit' width={24} height={24} />
              </IconButton>
            </Link>
          )}
          {data.status === 'PUBLISH' && (
            <div onClick={handleNavigation}>
              <IconButton disabled={loading} color='primary'>
                <CodiconEye />
              </IconButton>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default ListCard;