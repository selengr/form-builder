'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Button, IconButton } from '@mui/material';
import { IoIosArrowForward } from 'react-icons/io';
import useDesigner from '@/hooks/useDesigner';
import SettingsDialog from '../SettingsDialog/SettingsDialog';
import { CodiconEye } from '@/../public/images/home-page/EyeIcon';
import type { DesignerSidebarData } from './DesignerSidebar';

interface BuilderHeaderProps {
  data: DesignerSidebarData;
  formTitle: string;
  formLimitation: string | null;
  startFromContinue: boolean | null;
  onChangeName: (name: string) => void;
  onChangeLimitation: (value: string | null) => void;
  onChangeStartFromContinue: (value: boolean | null) => void;
  onPublish: () => void;
  isPublishing: boolean;
  isPublishDisabled: boolean;
  publishLabel: string;
  isDataCollection: boolean;
}

export default function BuilderHeader({
  data,
  formTitle,
  formLimitation,
  startFromContinue,
  onChangeName,
  onChangeLimitation,
  onChangeStartFromContinue,
  onPublish,
  isPublishing,
  isPublishDisabled,
  publishLabel,
  isDataCollection,
}: BuilderHeaderProps) {
  const { id } = useParams();
  const router = useRouter();
  const { formName } = useDesigner();

  const title = formTitle || formName || 'پرسشنامه جدید';

  const actionButtons = (
    <div className="flex items-center gap-2">
     
        <Link href={`/preview/${id}`}>
        <IconButton
          sx={{
            height: 32,
            width: 32,
            padding: "6px",
            border: 'none',
            borderRadius: '10px',
            backgroundColor: '#F7F7FF',
          }}
        >
          <CodiconEye color="#1758BA" className='p-0'/>
        </IconButton>
      </Link>

      {formTitle && (
        <SettingsDialog
          formName={formTitle}
          data={data}
          formLimitation={formLimitation}
          onChangeName={onChangeName}
          onChangeLimitation={onChangeLimitation}
          startFromContinue={startFromContinue}
          onChangeStartFromContinue={onChangeStartFromContinue}
        />
      )}


       {!isDataCollection && (
        <Button
          onClick={onPublish}
          variant="contained"
          loading={isPublishing}
          disabled={isPublishDisabled}
          sx={{
            backgroundColor: '#1758BA',
            fontWeight: 500,
            fontSize: 14,
            borderRadius: '12px',
            height: { xs: 32, lg: 32 },
            minWidth: { xs: 125, lg: 132 },
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#134a9e' },
          }}
        >
          {publishLabel}
        </Button>
      )}
    </div>
  );

  return (
    <>
      <div
        dir="rtl"
        className="hidden lg:flex items-center justify-between w-full px-1 pb-3 pr-5 pt-1 shrink-0"
      >
        <h1 className="text-[16px] font-bold text-[#161616] truncate max-w-[325px]">{title}</h1>
        {actionButtons}
      </div>

      <div dir="rtl" className="flex lg:hidden items-center justify-between w-full px-1 pb-3 shrink-0 relative">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center justify-center w-10 h-10 text-[#2A2A2A]"
          aria-label="بازگشت"
        >
          <IoIosArrowForward size={22} />
        </button>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-[16px] font-bold text-[#2A2A2A] truncate max-w-[60%] text-center">
          {title}
        </h1>
        <div className="w-10" />
      </div>
    </>
  );
}
