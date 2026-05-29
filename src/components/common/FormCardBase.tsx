'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { InfoRow } from '@/components/common/infoRow';
import { formTypePersian } from '@/constants/formDictionaries';
import ReportDialog from '@/components/ReportDialog/ReportDialog';
import BugIcon from '@/../public/images/home-page/menu/bugIcon.svg';
import { useShowResultUser } from '@/app/my-assessments/[id]/show-result/hooks/useShowResultUser';
import LoginWithPhone from './loginWithPhone';
import { useLoginWithPhone } from '../../hooks/useLoginWithPhone';
// actions
import { fetchUserInfoServer } from '../../../actions/auth';
// import { fetchUserInfo } from '@/lib/auth';

interface FormCardBaseProps {
  data: any;
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

type DialogState = 'none' | 'login' | 'report';

const FormCardBase: React.FC<FormCardBaseProps> = ({
  data,
  buttonText,
  buttonLink,
  buttonDisabled = false,
  showStatus = true,
}) => {
  const router = useRouter();
  const [dialogState, setDialogState] = useState<DialogState>('none');
  const { mutate } = useShowResultUser();
  const pathname = usePathname();

  const {
    formValue, error, reset, helperText, handleChange, handleSubmit
  } = useLoginWithPhone('');

 const handleClick = () => {
  if (!buttonLink) return;

  const basePath =
    typeof buttonLink === 'function'
      ? buttonLink(data.id)
      : buttonLink;

  if (pathname === '/my-assessments') {
    const params = new URLSearchParams({
      from: 'MY_ASSESSMENT',
    });

    router.push(`${basePath}?${params.toString()}`);
  } else {
    router.push(basePath);
  }
};

  const handleShowResult = () => {
    const tkId = data.takeParts[data.takeParts.length - 1]
    mutate({
      data: { formId: data.id, takePartId: tkId?.takePartId },
      name: data.name,
    });
  };

  const handleReport = async () => {
    const { userInfo } = await fetchUserInfoServer();
    const username = userInfo?.user?.username || null;
    setDialogState(username ? 'report' : 'login');
  };

  const parentSubmit = () => {
    if (handleSubmit()) {
      setDialogState('report');
    }
  };
  const handleCloseReportDialog = () => {
    if (handleSubmit()) {
      reset()
    }
    setDialogState('none')
  };

  return (
    <div className="border p-4 rounded-2xl border-[#DDE1E6] flex flex-col gap-3 w-full max-w-full relative hover:shadow-sm transition-shadow duration-200">
      {/* دکمه گزارش */}
      <div className="absolute top-2 left-2 z-10">
        <Button
          onClick={handleReport}
          size="medium"
          className="rounded-full min-w-[70px]"
          endIcon={<Image alt="report" src={BugIcon} height={20} width={20} />}
        >
          <span className="text-xs whitespace-nowrap">گزارش</span>
        </Button>
      </div>

      {/* اطلاعات فرم */}
      <div className="space-y-2">
        <InfoRow label="نام" value={data.name} bold />
        <InfoRow label="نوع" value={formTypePersian[data.type]} bold />
        {showStatus && (
          <InfoRow
            label="وضعیت"
            value={data.takeParts.length > 0 ? 'انجام شده' : 'انجام نشده'}
            bold
          />
        )}
      </div>

      {/* دکمه اصلی */}
      <div className="flex w-full gap-2 flex-row mt-2">
        <button
          disabled={buttonDisabled}
          className="bg-[#1758BA] disabled:bg-slate-300 hover:bg-[#216ee1] transition duration-200 px-3 h-[42px] w-full sm:w-auto sm:flex-1 text-[14px] rounded-lg text-white disabled:cursor-not-allowed"
          onClick={handleClick}
        >
          {buttonText}
        </button>
        {data.showReportForResponder && (
          <button
            className="bg-[#2CDFC9] disabled:bg-slate-300 hover:bg-[#2CDFC9] transition duration-200 px-3 h-[42px] w-full sm:w-auto sm:flex-1 text-[14px] rounded-lg text-white"
            onClick={handleShowResult}
          >
            مشاهده نتیجه
          </button>
        )}
      </div>

      {dialogState === 'login' && (
        <LoginWithPhone
          open
          onClose={() => setDialogState('none')}
          label={'شماره موبایل'}
          placeholder={'09129876543'}
          formValue={formValue}
          error={error}
          helperText={helperText}
          onChange={handleChange}
          onSubmit={parentSubmit}
        />
      )}

      {/* دیالوگ گزارش */}
      {dialogState === 'report' && (
        <ReportDialog
          userPhone={formValue}
          open
          onClose={handleCloseReportDialog}
          formId={data.id}
          typeOfReport="FORM"
        />
      )}
    </div>
  );
};

export default FormCardBase;