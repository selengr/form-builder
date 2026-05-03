'use client';

import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
// components
import { InfoRow } from '@/components/common/infoRow';
import { SwitchButton } from '@/components/Switch/SwitchButton';
// images
import EditIcon from '@/../public/images/home-page/edit-2.svg';
import PackagingSettingsDialog from './PackagingSettingsDialog';
// actions
import { updatePackagingValidity } from '../../../actions/packaging/packageSetting';

export interface IPackagingItem {
  id: number;
  name: string;
  formId: number;
  invalid: boolean;
  formCategorysModel: null;
  packagingStausEnum: "CREATE" | string;
  targetLabelEnum: "DEFAULT" | string;
}
interface ListCardProps {
  data: IPackagingItem;
  showStatus?: boolean;
}
// ---------------------------------------------------------------------
const ListCard: React.FC<ListCardProps> = ({
  data,
  showStatus = true,
}) => {
  const router = useRouter();
  const [checked, setChecked] = useState<boolean>(!data.invalid);
  const [isPending, startTransition] = useTransition();
  
  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setChecked(newValue);

    startTransition(() => {
       const newValue = event.target.checked;

          setChecked(newValue);

          startTransition(async () => {
            try {
              const result = await updatePackagingValidity(
                data.id,
                !newValue
              );

              if (!result.response) {
                setChecked(!newValue);
              }
              toast.success(newValue ? 'بسته فعال شد' : 'بسته غیرفعال شد');
            } catch (error: any) {
              setChecked(!newValue);
              toast.error(error?.message);
            }
          });
    });
  };

  return (
    <div className="border p-4 rounded-2xl border-[#DDE1E6] flex flex-col gap-3 w-full max-w-full relative">
      {/* اطلاعات فرم */}
      <InfoRow label="نام بسته" value={data.name} bold />
      <SwitchButton
        sx={{ position: "absolute", top: 15, right: 15 }}
        checked={checked}
        disabled={isPending}
        onChange={handleSwitchChange}
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
          onClick={() => router.push(`/preview/${data.formId}`)}>
          مشاهده
        </button>

        <div className='flex gap-2 flex-wrap items-center justify-end'>
          <PackagingSettingsDialog packageId={data.id} />
          {data.packagingStausEnum === "CREATE" &&
            <Link href={`/builder/${data.formId}?admin=packaging`}>
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