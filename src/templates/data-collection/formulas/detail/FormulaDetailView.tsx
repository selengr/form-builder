'use client';

import { toast } from 'sonner';
import { IconButton } from '@mui/material';
import { IoSettingsOutline } from 'react-icons/io5';
import { CodiconEye } from '@/../public/images/home-page/EyeIcon';
import PageContainer from '@/templates/layout/PageContainer';
import { useGetMinorFormulaList } from './useGetMinorFormulaList';
import MinorFormulaRow from './MinorFormulaRow';

interface FormulaDetailViewProps {
  majorId: string;
  majorName: string;
}

export default function FormulaDetailView({ majorId, majorName }: FormulaDetailViewProps) {
  const { minorList, isLoading } = useGetMinorFormulaList(majorId);

  const handleStub = () => {
    toast.info('این قابلیت به‌زودی اضافه می‌شود');
  };

  return (
    <PageContainer>
      <div dir="rtl" className="flex flex-col w-full h-full p-4 gap-4 overflow-y-auto">
        <div className="flex items-center justify-between w-full shrink-0">
          <h1 className="text-lg font-bold text-[#161616]">{majorName || 'فرمول'}</h1>

          <div className="flex items-center gap-2">
            <IconButton
              onClick={handleStub}
              sx={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                bgcolor: '#F0F3FF',
                color: '#1758BA',
              }}>
              <CodiconEye fontSize="1.4rem" />
            </IconButton>

            <IconButton
              onClick={handleStub}
              sx={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                bgcolor: '#F0F3FF',
                color: '#1758BA',
              }}>
              <IoSettingsOutline fontSize="1.4rem" />
            </IconButton>

            <button
              onClick={handleStub}
              className="bg-[#1758BA] hover:bg-[#216ee1] transition-all duration-200 px-6 h-[44px] text-sm rounded-xl text-white">
              ثبت نهایی
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full">
          {isLoading && <p className="text-sm text-[#9EA3AC]">در حال بارگذاری...</p>}

          {!isLoading && minorList.length === 0 && (
            <p className="text-sm text-[#9EA3AC]">هیچ فرمول جزئی ثبت نشده است</p>
          )}

          {minorList.map((item, index) => (
            <MinorFormulaRow key={item.id} index={index} />
          ))}

          <button
            onClick={handleStub}
            className="w-full h-[52px] rounded-xl border border-dashed border-[#DDE1E6] text-sm text-[#6F6F6F]">
            افزودن فرمول جزئی
          </button>
        </div>

        <div className="flex-1" />

        <button
          onClick={handleStub}
          className="w-full h-[52px] rounded-xl border border-dashed border-[#DDE1E6] text-sm text-[#6F6F6F] shrink-0">
          افزودن فرمول کلی
        </button>
      </div>
    </PageContainer>
  );
}
