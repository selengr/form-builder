'use client';

import {useRouter} from 'next/navigation';
import {formStatusPersian, formTypePersian} from '@/constants/formDictionaries';
import Image from 'next/image';
import {InfoRow} from '@/components/common/infoRow';
import {useState} from 'react';
import BugIcon from '@/../public/images/home-page/menu/bugIcon.svg';
import {Button} from '@mui/material';
import ReportDialog from '@/components/ReportDialog/ReportDialog';

interface FormCardBaseProps {
  data: any;
  buttonText: string;
  buttonLink?: string | ((id: string) => string);
  buttonDisabled?: boolean;
  showStatus?: boolean;
}

const FormCardBase: React.FC<FormCardBaseProps> = ({
                                                     data,
                                                     buttonText,
                                                     buttonLink,
                                                     buttonDisabled = false,
                                                     showStatus = true,
                                                   }) => {
  const router = useRouter();
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  const handleClick = () => {
    if (!buttonLink) return;
    const href = typeof buttonLink === 'function' ? buttonLink(data.id) : buttonLink;
    router.push(href);
  };

  return (
    <div className="border p-4 rounded-2xl border-[#DDE1E6] flex flex-col gap-3 w-full max-w-full relative">
      {/* دکمه گزارش */}
      <div className="absolute top-2 left-2 z-10">
        <Button
          onClick={() => setIsReportDialogOpen(true)}
          size="medium"
          className="rounded-full"
          endIcon={<Image alt="report" src={BugIcon} height={24} width={24}/>}
        >
          <span className="text-xs">گزارش</span>
        </Button>
      </div>

      {/* اطلاعات فرم */}
      <InfoRow label="نام" value={data.name} bold/>
      <InfoRow label="نوع" value={formTypePersian[data.type]} bold/>
      {showStatus && (
        <InfoRow
          label="وضعیت"
          value={data?.isCompleted ? 'انجام شده' : 'انجام نشده'}
          bold
        />
      )}

      {/* دکمه اصلی */}
      <div className="flex w-full gap-2">
        <button
          disabled={buttonDisabled}
          className="bg-[#1758BA] disabled:bg-slate-300 hover:bg-[#216ee1] transition duration-200 max-w-full sm:max-w-[200px] px-2 h-[42px] w-full text-[14px] rounded-lg text-white"
          onClick={handleClick}
        >
          {buttonText}
        </button>
      </div>

      {/* دیالوگ گزارش */}
      <ReportDialog
        open={isReportDialogOpen}
        onClose={() => setIsReportDialogOpen(false)}
        formId={data.id}
        typeOfReport="FORM"
      />
    </div>
  );
};

export default FormCardBase;