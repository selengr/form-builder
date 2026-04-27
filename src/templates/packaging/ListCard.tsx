'use client';

import Link from 'next/link';
import Image from 'next/image';
import { IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
// components
import { InfoRow } from '@/components/common/infoRow';
import { SwitchButton } from '@/components/Switch/SwitchButton';
// images
import CopyIcon from '@/../public/images/home-page/copy.svg';
import EditIcon from '@/../public/images/home-page/edit-2.svg';
import TrashIcon from '@/../public/images/home-page/trash.svg';

export interface IPackagingItem {
  formCategorysModel: null;
  formId: number;
  id: number;
  name: string;
  packagingStausEnum: "CREATE" | string; 
  targetLabelEnum: "DEFAULT"| string; 
}

interface ListCardProps {
  data: IPackagingItem;
  buttonText: string;
  buttonLink?: string | ((id: string) => string);
  buttonDisabled?: boolean;
  showStatus?: boolean;
}

// ---------------------------------------------------------------------
const ListCard: React.FC<ListCardProps> = ({
  data,
  buttonText,
  buttonLink,
  buttonDisabled = false,
  showStatus = true,
}) => {
  const router = useRouter();
console.log('data', data)
  return (
    <div className="border p-4 rounded-2xl border-[#DDE1E6] flex flex-col gap-3 w-full max-w-full relative">
      {/* اطلاعات فرم */}
      <InfoRow label="نام بسته" value={data.name} bold />
      <SwitchButton
        sx={{ position: "absolute", top: 15, right: 15 }}
        checked={true}
        onChange={() => console.log("object")}
      />
      {showStatus && (
        <InfoRow
          label="وضعیت"
          value={data?.packagingStausEnum === "CREATE" ? 'ایجاد شده' : 'نهایی'}
          bold
        />
      )}

      <div className='flex flex-wrap gap-2 w-full justify-between'>
        <button
          className='bg-[#1758BA] max-w-36 hover:bg-[#216ee1] transition-all duration-200 px-3 h-[42px] text-sm rounded-lg text-white grow sm:grow md:flex-1'
          onClick={() => router.push(`/preview/${data.id}`)}>
          مشاهده
        </button>

        <div className='flex gap-2 flex-wrap items-center justify-end'>
          <IconButton onClick={() => console.log("object")} color='error'>
            <Image src={TrashIcon} alt='delete' width={24} height={24} />
          </IconButton>

          <IconButton>
            <Image src={CopyIcon} alt='copy' width={24} height={24} />
          </IconButton>

          {data.packagingStausEnum === "CREATE" &&
            <Link href={`/builder/${data.id}?admin=survey`}>
              <IconButton color='primary'>
                <Image src={EditIcon} alt='edit' width={24} height={24} />
              </IconButton>
            </Link>
          }
        </div>
      </div>
    </div>
  );
};

export default ListCard;