'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { InfoRow } from '@/components/common/infoRow';
import { formTypePersian } from '@/constants/formDictionaries';
import ReportDialog from '@/components/ReportDialog/ReportDialog';
import BugIcon from '@/../public/images/home-page/menu/bugIcon.svg';
import { useShowResultUser } from '@/app/my-assessments/[id]/show-result/hooks/useShowResultUser';
import { fetchUserInfo } from '@/lib/auth';
import LoginWithPhone from './loginWithPhone';
import { useLoginWithPhone } from './useLoginWithPhone';

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

  const {
    formValue, error, reset, helperText, handleChange, handleSubmit
  } = useLoginWithPhone('');

  const handleClick = () => {
    if (!buttonLink) return;
    const href = typeof buttonLink === 'function' ? buttonLink(data.id) : buttonLink;
    router.push(href);
  };

  const handleShowResult = () => {
    const tkId = data.takeParts[data.takeParts.length - 1]
    mutate({
      data: { formId: data.id, takePartId: tkId?.takePartId },
      name: data.name,
    });
  };

  const handleReport = async () => {
    const { userInfo } = await fetchUserInfo();
    const username = userInfo?.user?.username || null;
    setDialogState(username ? 'report' : 'login');
  };

  const parentSubmit = () => {
    if (handleSubmit()) {
      reset()
      setDialogState('report');
    }
  };

  return (
    <div className="border p-4 rounded-2xl border-[#DDE1E6] flex flex-col gap-3 w-full max-w-full relative">
      {/* دکمه گزارش */}
      <div className="absolute top-2 left-2 z-10">
        <Button
          onClick={handleReport}
          size="medium"
          className="rounded-full"
          endIcon={<Image alt="report" src={BugIcon} height={24} width={24} />}
        >
          <span className="text-xs">گزارش</span>
        </Button>
      </div>

      {/* اطلاعات فرم */}
      <InfoRow label="نام" value={data.name} bold />
      <InfoRow label="نوع" value={formTypePersian[data.type]} bold />
      {showStatus && (
        <InfoRow
          label="وضعیت"
          value={data?.isCompleted ? 'انجام شده' : 'انجام نشده'}
          bold
        />
      )}

      {/* دکمه اصلی */}
      <div className="flex w-full gap-2 flex-row">
        <button
          disabled={buttonDisabled}
          className="bg-[#1758BA] disabled:bg-slate-300 hover:bg-[#216ee1] transition duration-200 max-w-full sm:max-w-[200px] px-2 h-[42px] w-full text-[14px] rounded-lg text-white"
          onClick={handleClick}
        >
          {buttonText}
        </button>
        {/* { data.takeParts.length > 0 && */}
        {data.takeParts.length > 0 &&
          <button
            className="bg-[#2CDFC9] disabled:bg-slate-300 hover:bg-[#2CDFC9] transition duration-200 max-w-full sm:max-w-[200px] px-2 h-[42px] w-full text-[14px] rounded-lg text-white"
            onClick={handleShowResult}
          >
            مشاهده نتیجه
          </button>
        }
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
          onClose={() => setDialogState('none')}
          formId={data.id}
          typeOfReport="FORM"
        />
      )}
    </div>
  );
};

export default FormCardBase;