'use client';

import {useRouter} from 'next/navigation';
import {formStatusPersian, formTypePersian} from '@/constants/formDictionaries';
import Image from 'next/image';
import {InfoRow} from '@/components/common/infoRow';
import React, {useState} from 'react';
import BugIcon from '@/../public/images/home-page/menu/bugIcon.svg';
import {Button} from '@mui/material';
import ReportDialog from '@/components/ReportDialog/ReportDialog';

interface FormCardBaseProps {
  data: any;
  buttonText: string;
  buttonLink?: string | ((id: string) => string);
  buttonDisabled?: boolean
}

export default function FormCardBase({data, buttonText, buttonLink, buttonDisabled = false}: FormCardBaseProps) {
  const router = useRouter();
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  const handleClick = () => {
    if (!buttonLink) return;
    const href = typeof buttonLink === 'function' ? buttonLink(data.id) : buttonLink;
    router.push(href);
  };

  const handleOpenReportDialog = () => {
    setIsReportDialogOpen(true);
  };

  const handleCloseReportDialog = () => {
    setIsReportDialogOpen(false);
  };

  return (
    <div className='border p-4 rounded-2xl border-[#DDE1E6] flex flex-col gap-3 w-full max-w-full relative'>
      <div className='absolute top-2 left-2 z-10'>
        <Button onClick={handleOpenReportDialog} size='medium' className={'rounded-full'}
                endIcon={<Image alt={'report'} src={BugIcon} height={24} width={24}/>}>
          <span className={'text-xs'}>گزارش</span>
        </Button>
      </div>

      <InfoRow label='نام' value={data.name} bold/>
      <InfoRow label='نوع' value={formTypePersian[data.type]} bold/>
      {/*<InfoRow label='دسترسی' value={data.accessType || 'عمومی'} bold/>*/}
      <InfoRow label='وضعیت' value={data?.isCompleted ? "انجام شده" : "انجام نشده"} bold/>

      <div className='flex w-full gap-2'>
        <button disabled={buttonDisabled}
                className='bg-[#1758BA] disabled:bg-slate-300 hover:bg-[#216ee1] transition-all duration-200 max-w-full sm:max-w-[200px] px-2 h-[42px] w-full text-[14px] rounded-lg text-white'
                onClick={handleClick}>
          {buttonText}
        </button>
      </div>

      <ReportDialog open={isReportDialogOpen} onClose={handleCloseReportDialog} formId={data.id} typeOfReport={'FORM'}/>
    </div>
  );
}
