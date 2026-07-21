'use client';

import Image from 'next/image';
import { toast } from 'sonner';
import { IconButton, Tooltip } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { LuHammer } from 'react-icons/lu';
import { ActionButton } from '@/templates/reports/ListCard';
import { InfoRow } from '@/components/common/infoRow';
import { SwitchButton } from '@/components/Switch/SwitchButton';
import { UnifiedListGridCardProps } from '@/components/unified-list-grid';
import EditIcon from '@/../public/images/home-page/edit-2.svg';
import PackagingSettingsDialog from '@/templates/packaging/PackagingSettingsDialog';
import { updatePackagingValidity } from '@actions/packaging/packageSetting';
import PickUpPackagingRequestDialog from './PickUpPackagingRequestDialog';
import {
  getPackagingStatusLabel,
  getPackagingStatusStyle,
  isPackagingRequestItem,
} from './constants';
import { PackagingListItem } from './types';

export const REPORT_BACK_KEY = 'report_return_path';
export const SELECTED_PACKAG_ID_KEY = 'selectedPackageId';

const LIST_PAGE_PATH = '/packaging-new';

export default function PackagingListCard({
  data,
  refreshGrid,
}: UnifiedListGridCardProps<PackagingListItem>) {
  const router = useRouter();
  const [checked, setChecked] = useState<boolean>(!data.invalid);
  const [isPending, startTransition] = useTransition();
  const [pickUpDialogOpen, setPickUpDialogOpen] = useState(false);

  const isPackagingRequest = isPackagingRequestItem(data.type);
  const statusStyle = getPackagingStatusStyle(data.packagingStausEnum);
  const isWaitForCreate = data.packagingStausEnum === 'WAIT_FOR_CREATE';
  const isCreateStatus = data.packagingStausEnum === 'CREATE';

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setChecked(newValue);

    startTransition(async () => {
      try {
        const result = await updatePackagingValidity(data.id, !newValue);

        if (!result.success) {
          setChecked(!newValue);
          toast.error(result.message || 'خطا در تغییر وضعیت بسته');
          return;
        }

        toast.success(newValue ? 'بسته فعال شد' : 'بسته غیرفعال شد');
      } catch (error: unknown) {
        setChecked(!newValue);
        toast.error(error instanceof Error ? error.message : 'خطا در تغییر وضعیت بسته');
      }
    });
  };

  const handleEditClick = () => {
    router.push(`/builder/${data.formId}?admin=packaging&pid=${data.id}`);
  };

  const handlePreview = () => {
    if (!data.formId) return;

    const params = new URLSearchParams({
      from: 'TESTING',
    });
    router.push(`form/${data.formId}?${params.toString()}`);
  };

  const handleNavigateToReport = () => {
    localStorage.setItem(REPORT_BACK_KEY, LIST_PAGE_PATH);
    router.push(`/reports/create-solo/${data.formId}`);
  };

  return (
    <>
      <div
        className={`border p-4 rounded-2xl flex flex-col gap-3 w-full max-w-full relative shadow-sm ${
          isPackagingRequest ? 'border-amber-300' : 'border-[#DDE1E6]'
        }`}>
        <InfoRow label="نام بسته" value={data.name} bold />
        <SwitchButton
          sx={{ position: 'absolute', top: 15, right: 15 }}
          checked={checked}
          disabled={isPending}
          onChange={handleSwitchChange}
        />
        <InfoRow
          label="وضعیت"
          value={
            <span
              className="inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold"
              style={{
                backgroundColor: statusStyle.backgroundColor,
                color: statusStyle.color,
              }}>
              {getPackagingStatusLabel(data.packagingStausEnum)}
            </span>
          }
          bold
        />

        <div className="flex flex-wrap gap-1 w-full justify-between">
          <div className="flex items-center gap-1 flex-wrap">
            <div className="max-w-[100px] md:min-w-[105px]">
              <ActionButton
                label="پیش نمایش"
                onClick={handlePreview}
                color="#1758BA"
                hoverColor="#216ee1"
              />
            </div>
            <div className="min-w-[114px] max-w-[110px]">
              <ActionButton
                label={data.isCreatedSoloReport ? 'ویرایش گزارش' : 'ساخت گزارش'}
                onClick={handleNavigateToReport}
                color="#2CDFC9"
                hoverColor="#22E2CF"
              />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap items-center justify-end">
            <PackagingSettingsDialog packageId={data.id} />
            {isWaitForCreate && (
              <Tooltip title="شروع ساخت" arrow placement="top">
                <IconButton
                  aria-label="شروع ساخت"
                  onClick={() => setPickUpDialogOpen(true)}
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    border: '1px solid #F59E0B',
                    bgcolor: '#FFF4E5',
                    color: '#B45309',
                    transition: 'background-color 0.2s, border-color 0.2s',
                    '&:hover': {
                      bgcolor: '#FEF3C7',
                      borderColor: '#D97706',
                    },
                  }}>
                  <LuHammer size={20} strokeWidth={2.25} />
                </IconButton>
              </Tooltip>
            )}
            {isCreateStatus && (
              <div onClick={handleEditClick}>
                <IconButton color="primary" sx={{ padding: 0 }}>
                  <Image src={EditIcon} alt="edit" width={24} height={24} />
                </IconButton>
              </div>
            )}
          </div>
        </div>
      </div>

      <PickUpPackagingRequestDialog
        open={pickUpDialogOpen}
        packageId={data.id}
        packageName={data.name}
        onClose={() => setPickUpDialogOpen(false)}
        onSuccess={refreshGrid}
      />
    </>
  );
}
