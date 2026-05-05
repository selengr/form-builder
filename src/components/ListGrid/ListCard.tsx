'use client';

import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button, IconButton } from '@mui/material';
import { AiOutlinePieChart } from 'react-icons/ai';
import React, { useCallback, useState } from 'react';
// services
import { AxiosApi } from '@/services/axios/AxiosApi';
// components
import ConfirmDialog from '../confirm-dialog';
import { InfoRow } from '@/components/common/infoRow';
import { SwitchButton } from '@/components/Switch/SwitchButton';
import PublishSettingsDialog from '../PublishSettingsDialog/PublishSettingsDialog';
// image
import EditIcon from '@/../public/images/home-page/edit-2.svg';
import CopyIcon from '@/../public/images/home-page/copy.svg';
import TrashIcon from '@/../public/images/home-page/trash.svg';
// constants
import { formStatusPersian, formTypePersian, TFormType } from '@/constants/formDictionaries';

interface ListCardProps {
  data: {
    id: string;
    name: string;
    ratio: number;
    status: string;
    type: TFormType;
    accessType?: string;
    participants: number;
    accessibility: string[];
    formPublishSetting: {
      capacityPublicLink: number | null;
    };
    questionListSize: number;
  };
  setRefreshGrid: (fn: (prev: any) => boolean) => void;
}

export default function ListCard({ data, setRefreshGrid }: ListCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const handlePublishStatus = useCallback(async () => {
    try {
      setLoading(true);
      const newStatus = data.status === 'PUBLISH' ? 'UN_PUBLISH' : 'PUBLISH';
      const res = await AxiosApi.put('/form/change-status', {
        formId: data.id,
        formBuilderStatusEnum: newStatus,
      });
      if (res.data) {
        toast.success('عملیات با موفقیت انجام شد');
        setRefreshGrid((prev) => !prev);
      }
    } catch (error) {
      console.error(error);
      toast.error('عملیات ناموفق بود. مجدداً تلاش کنید.');
    } finally {
      setLoading(false);
    }
  }, [data.id, data.status, setRefreshGrid]);

  const handleCopy = useCallback(async () => {
    try {
      setLoading(true);
      const res = await AxiosApi.post(`/form/${data.id}/duplicate`);
      if (res.data) {
        toast.success('رونوشت با موفقیت انجام شد');
        setRefreshGrid((prev) => !prev);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [data.id, setRefreshGrid]);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await AxiosApi.delete(`/form/${data.id}`);
      if (res.data) {
        toast.success(`فرم (${data.name}) با موفقیت حذف شد`);
        setRefreshGrid((prev) => !prev);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = () => {
    localStorage.setItem("stats", "/builder")
    router.push(`stats/${data.id}`)
  }

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
  const isPackaging = data?.type === "PACKAGING";
  return (
    <>
      <div
        className={`
    border p-4 rounded-[20px] flex flex-col gap-4 w-full max-w-full relative
    transition-all duration-200
    hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]
    ${isPackaging ? "border-amber-300" : "border-[#DDE1E6]"
          }`}
      //   ${data.type === 'PACKAGING'
      //           ? 'border-[#9BB8F2] bg-[#f5f8ff] shadow-[0_0_12px_rgba(23,88,186,0.07)]'
      //           : 'border-[#DDE1E6] hover:border-[#cfd6df]'
      //         }
      // `}
      >

        {/* {data.type === 'PACKAGING' && (
          <div className="absolute top-2 left-2 bg-[#E8F0FF] text-[#1758BA] text-[12px] px-3 py-[4px] rounded-[8px] shadow-sm border border-[#bfd4ff] leading-none">
           
          </div>
        )} */}
        {isPackaging && (
          <div className={`mt-2 absolute left-4 w-fit rounded-full bg-amber-100 px-2 py-1 text-[10px] font-medium text-amber-700
            ${(data.status === 'PUBLISH' || data.status === 'UN_PUBLISH') ? "mt-8" : "mt-2"
            }`}
          >
            ضریب قیمت {data.ratio}
          </div>
        )}

        {/* <div className='border p-4 rounded-[20px] border-[#DDE1E6] flex flex-col gap-4 w-full max-w-full relative'> */}
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-3'>
          <InfoRow label='نام' value={data.name} bold />
          {(data.status === 'PUBLISH' || data.status === 'UN_PUBLISH') && <SwitchButton disabled={loading} checked={data.status === 'PUBLISH'} onChange={handlePublishStatus} />}
        </div>

        <div className='grid grid-cols-1 gap-2'>
          <InfoRow label='نوع' value={formTypePersian[data.type]} bold />
          <InfoRow label='دسترسی' value={getAccessLabel(data.accessibility)} bold />
          <InfoRow label='تعداد شرکت‌کننده' value={data.participants} bold />
          <InfoRow label='تعداد گویه' value={data.questionListSize} bold />
          <InfoRow label='ظرفیت عمومی' value={data.formPublishSetting.capacityPublicLink ?? 0} bold />
          <InfoRow label='وضعیت' value={formStatusPersian[data.status]} bold />
        </div>

        <div className='flex flex-wrap gap-2 w-full justify-between'>
          <button
            className='bg-[#1758BA] max-w-[120px] hover:bg-[#216ee1] transition-all duration-200 px-3 h-[42px] text-sm rounded-lg text-white grow sm:grow md:flex-1'
            onClick={() => router.push(`/preview/${data.id}`)}>
            مشاهده
          </button>

          <div className='flex gap-2 flex-wrap items-center justify-end'>
            <IconButton onClick={() => setOpenConfirmDialog(true)} disabled={loading} color='error'>
              <Image src={TrashIcon} alt='delete' width={24} height={24} />
            </IconButton>

            {(data.type === "PACKAGING" || data.status === 'READY_TO_PUBLISH' || data.status === 'PUBLISH') && <PublishSettingsDialog formData={data} formId={data.id} />}

            {data.type !== "PACKAGING" && (
              <IconButton onClick={handleCopy} disabled={loading}>
                <Image src={CopyIcon} alt='copy' width={24} height={24} />
              </IconButton>
            )}

            {data.status === 'CREATE' && data.type !== "PACKAGING" && (
              <Link href={`/builder/${data.id}`}>
                <IconButton disabled={loading} color='primary'>
                  <Image src={EditIcon} alt='edit' width={24} height={24} />
                </IconButton>
              </Link>
            )}

            <div onClick={handleNavigation}>
              <IconButton disabled={loading}>
                <AiOutlinePieChart color='#424242' />
              </IconButton>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        title={`حذف فرم (${data.name})`}
        content='آیا مطمئن هستید که می‌خواهید این فرم را به‌طور کامل حذف کنید؟'
        cancelText='انصراف'
        loading={loading}
        action={
          <Button
            fullWidth
            disabled={loading}
            variant='contained'
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
