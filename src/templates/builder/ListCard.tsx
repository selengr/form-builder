'use client';

import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button, IconButton } from '@mui/material';
import { AiOutlinePieChart } from 'react-icons/ai';
import React, { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
// components
import ConfirmDialog from '@/components/confirm-dialog';
import { InfoRow } from '@/components/common/infoRow';
import SettingsDialog from '@/components/SettingsDialog/SettingsDialog';
import { SwitchButton } from '@/components/Switch/SwitchButton';
import PublishSettingsDialog from '@/components/PublishSettingsDialog/PublishSettingsDialog';
import { UnifiedListGridCardProps } from '@/components/unified-list-grid';
// image
import EditIcon from '@/../public/images/home-page/edit-2.svg';
import CopyIcon from '@/../public/images/home-page/copy.svg';
import TrashIcon from '@/../public/images/home-page/trash.svg';
// constants
import { formStatusPersian, formTypePersian } from '@/constants/formDictionaries';
// actions
import { changeFormStatusAction } from '@actions/builder/changeFormStatusAction';
import { duplicateFormAction } from '@actions/builder/duplicateFormAction';
import { deleteFormAction } from '@actions/builder/deleteFormAction';
import { BUILDER_LIST_QUERY_KEY, BuilderListItem } from './types';

export default function ListCard({ data }: UnifiedListGridCardProps<BuilderListItem>) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const invalidateList = () => {
    queryClient.invalidateQueries({ queryKey: [BUILDER_LIST_QUERY_KEY] });
  };

  const handlePublishStatus = useCallback(async () => {
    try {
      setLoading(true);
      const newStatus = data.status === 'PUBLISH' ? 'UN_PUBLISH' : 'PUBLISH';
      const res = await changeFormStatusAction({
        formId: data.id,
        formBuilderStatusEnum: newStatus,
      });

      if (!res.success) {
        throw new Error(res.message);
      }

      toast.success('عملیات با موفقیت انجام شد');
      invalidateList();
    } catch (error) {
      console.error(error);
      toast.error('عملیات ناموفق بود. مجدداً تلاش کنید.');
    } finally {
      setLoading(false);
    }
  }, [data.id, data.status, queryClient]);

  const handleCopy = useCallback(async () => {
    try {
      setLoading(true);
      const res = await duplicateFormAction(data.id);

      if (!res.success) {
        throw new Error(res.message);
      }

      toast.success('رونوشت با موفقیت انجام شد');
      invalidateList();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [data.id, queryClient]);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await deleteFormAction(data.id);

      if (!res.success) {
        throw new Error(res.message);
      }

      toast.success(`فرم (${data.name}) با موفقیت حذف شد`);
      invalidateList();
      setOpenConfirmDialog(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = () => {
    localStorage.setItem('stats', '/builder');
    router.push(`stats/${data.id}`);
  };

  const handlePreview = () => {
    if (!data.id) return;
    const params = new URLSearchParams({
      from: 'TESTING',
      source: 'builder',
    });
    router.push(`/form/${data.id}?${params.toString()}`);
  };

  const getAccessLabel = (accessType?: string[]) => {
    if (!accessType || accessType.length === 0) return 'نامشخص';

    const hasPublic = accessType.includes('PUBLIC');
    const hasAssign = accessType.includes('ASSIGN');
    const hasNoAccess = accessType.includes('NO_ACCESS');

    if (hasPublic && hasAssign) return 'عمومی - اختصاصی';
    if (hasPublic) return 'عمومی';
    if (hasAssign) return 'اختصاصی';
    if (hasNoAccess) return 'بدون دسترسی';

    return 'نامشخص';
  };

  const isPackaging = data?.type === 'PACKAGING';

  return (
    <>
      <div
        className={`
          border p-4 rounded-[20px] flex flex-col gap-4 w-full max-w-full relative
          transition-all duration-200
          hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]
          ${isPackaging ? 'border-amber-300' : 'border-[#DDE1E6]'}
        `}>
        {isPackaging && (
          <div
            className={`mt-2 absolute left-4 w-fit rounded-full bg-amber-100 px-2 py-1 text-[10px] font-medium text-amber-700 ${
              data.status === 'PUBLISH' || data.status === 'UN_PUBLISH' ? 'mt-8' : 'mt-2'
            }`}>
            ضریب قیمت {data.ratio}
          </div>
        )}

        <div className="flex flex-row justify-between items-center gap-3">
          <InfoRow label="نام" value={data.name} bold />
          {(data.status === 'PUBLISH' || data.status === 'UN_PUBLISH') && (
            <SwitchButton
              disabled={loading}
              checked={data.status === 'PUBLISH'}
              onChange={handlePublishStatus}
            />
          )}
        </div>

        <div className="grid grid-cols-1 gap-2">
          <InfoRow label="نوع" value={formTypePersian[data.type]} bold />
          <InfoRow label="دسترسی" value={getAccessLabel(data.accessibility)} bold />
          <InfoRow label="تعداد شرکت‌کننده" value={data.participants} bold />
          <InfoRow label="تعداد گویه" value={data.questionListSize} bold />
          <InfoRow
            label="ظرفیت عمومی"
            value={data.formPublishSetting.capacityPublicLink ?? 0}
            bold
          />
          <InfoRow label="وضعیت" value={formStatusPersian[data.status]} bold />
        </div>

        <div className="flex flex-wrap gap-2 w-full justify-between">
          <button
            className="bg-[#1758BA] max-w-[120px] hover:bg-[#216ee1] transition-all duration-200 px-3 h-[42px] text-sm rounded-lg text-white grow sm:grow md:flex-1"
            onClick={handlePreview}>
            پیش نمایش
          </button>

          <div className="flex gap-2 flex-wrap items-center justify-end">
            {data.status !== 'PUBLISH' && (
              <IconButton
                onClick={() => setOpenConfirmDialog(true)}
                disabled={loading}
                color="error">
                <Image src={TrashIcon} alt="delete" width={24} height={24} unoptimized />
              </IconButton>
            )}
            {(data.type === 'PACKAGING' ||
              data.status === 'READY_TO_PUBLISH' ||
              data.status === 'PUBLISH') && (
              <PublishSettingsDialog formData={data} formId={data.id} />
            )}

            {data.type !== 'PACKAGING' && (
              <IconButton onClick={handleCopy} disabled={loading}>
                <Image src={CopyIcon} alt="copy" width={24} height={24} unoptimized />
              </IconButton>
            )}

            {data.status !== 'CREATE' && (
              <SettingsDialog
                data={data}
                isBuilderCardId={data.id}
                formName={data.name}
                formLimitation={data?.formSettingModel?.responseLimitation ?? null}
                startFromContinue={data?.formSettingModel?.startFromContinue ?? null}
              />
            )}

            {data.status === 'CREATE' && data.type !== 'PACKAGING' && (
              <Link href={`/builder/${data.id}`}>
                <IconButton disabled={loading} color="primary">
                  <Image src={EditIcon} alt="edit" width={24} height={24} unoptimized />
                </IconButton>
              </Link>
            )}

            <div onClick={handleNavigation}>
              <IconButton disabled={loading}>
                <AiOutlinePieChart color="#424242" />
              </IconButton>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        title={`حذف فرم (${data.name})`}
        content="آیا مطمئن هستید که می‌خواهید این فرم را به‌طور کامل حذف کنید؟"
        cancelText="انصراف"
        loading={loading}
        action={
          <Button
            fullWidth
            disabled={loading}
            variant="contained"
            onClick={handleDelete}
            sx={{
              fontWeight: '400',
              fontSize: '15px',
              height: '45px',
              borderRadius: '8px',
              '&:hover': {
                bgcolor: (theme) => theme.palette.primary.main,
              },
            }}>
            تایید
          </Button>
        }
      />
    </>
  );
}
