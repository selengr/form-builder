'use client';

import Image from 'next/image';
import { toast } from 'sonner';
import { IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
// components
import { ActionButton } from '../reports/ListCard';
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
  isCreatedSoloReport: boolean;
  packagingStausEnum: "CREATE" | string;
  targetLabelEnum: "DEFAULT" | string;
}
interface ListCardProps {
  data: IPackagingItem;
  showStatus?: boolean;
}
export const REPORT_BACK_KEY = 'report_return_path';
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

  const handleEditClick = () => {
    try {
      localStorage.setItem('selectedPackageId', String(data.id));
    } catch { }

    router.push(`/builder/${data.formId}?admin=packaging`);
  };

  const handleNavigateToReport = () => {
    localStorage.setItem(REPORT_BACK_KEY, "/packaging");
    router.push(`/reports/create-solo/${data.formId}`)
  }

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

      <div className='flex flex-wrap gap-1 w-full justify-between'>

        <div className="flex items-center gap-1 flex-wrap">
          <div className="max-w-[100px] md:min-w-[105px]">
            <ActionButton
              label="مشاهده"
              onClick={handleEditClick}
              color="#1758BA"
              hoverColor="#216ee1"
            />
          </div>
          <div className="min-w-[114px] max-w-[110px]">
            <ActionButton
              label={data.isCreatedSoloReport ? "ویرایش گزارش" : "ساخت گزارش"}
              onClick={handleNavigateToReport}
              color="#2CDFC9"
              hoverColor="#22E2CF"
            />
          </div>
        </div>

        <div className='flex gap-2 flex-wrap items-center justify-end'>
          <PackagingSettingsDialog packageId={data.id} />
          {data.packagingStausEnum === "CREATE" &&
            <div onClick={handleEditClick}>
              <IconButton color='primary' sx={{padding:0}}>
                <Image src={EditIcon} alt='edit' width={24} height={24} />
              </IconButton>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default ListCard;