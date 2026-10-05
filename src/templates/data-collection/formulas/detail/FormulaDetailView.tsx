'use client';

import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button, IconButton } from '@mui/material';
import { IoIosArrowForward } from 'react-icons/io';
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
  const router = useRouter();
  const { minorList, isLoading } = useGetMinorFormulaList(majorId);

  const handleStub = () => {
    toast.info('این قابلیت به‌زودی اضافه می‌شود');
  };

  const title = majorName || 'فرمول';

  return (
    <PageContainer>
      <div className="flex flex-col w-full h-full">
        <div
          dir="rtl"
          className="hidden lg:flex items-center justify-between w-full px-1 pb-3 pr-5 pt-1 shrink-0">
          <h1 className="text-[16px] font-bold text-[#161616] truncate max-w-[325px]">{title}</h1>

          <div className="flex items-center gap-2">
            <IconButton
              onClick={handleStub}
              sx={{
                height: 32,
                width: 32,
                padding: '6px',
                border: 'none',
                borderRadius: '10px',
                backgroundColor: '#F7F7FF',
              }}>
              <CodiconEye color="#1758BA" className="p-0" />
            </IconButton>

            <IconButton
              onClick={handleStub}
              sx={{
                height: { xs: 48, md: 32 },
                width: { xs: 48, md: 32 },
                padding: { xs: '13px', md: '6px' },
                border: 'none',
                borderRadius: '10px',
                backgroundColor: '#F7F7FF',
              }}>
              <IoSettingsOutline color="#1758BA" className="p-0" />
            </IconButton>

            <Button
              onClick={handleStub}
              variant="contained"
              sx={{
                backgroundColor: '#1758BA',
                fontWeight: 500,
                fontSize: 14,
                borderRadius: '12px',
                height: 32,
                minWidth: 132,
                boxShadow: 'none',
                '&:hover': { backgroundColor: '#134a9e' },
              }}>
              ثبت نهایی
            </Button>
          </div>
        </div>

        <div
          dir="rtl"
          className="flex lg:hidden items-center justify-between w-full px-1 pb-3 pt-1 shrink-0 relative">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 text-[#2A2A2A]"
            aria-label="بازگشت">
            <IoIosArrowForward size={22} />
          </button>
          <h1 className="absolute left-1/2 -translate-x-1/2 text-[16px] font-bold text-[#2A2A2A] truncate max-w-[60%] text-center">
            {title}
          </h1>
          <div className="w-10" />
        </div>

        <div
          dir="rtl"
          className="flex flex-col w-full flex-1 px-4 pb-4 lg:pb-4 gap-4 overflow-y-auto">
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
            className="w-full h-[52px] rounded-xl border border-dashed border-[#DDE1E6] text-sm text-[#6F6F6F] shrink-0 mb-20 lg:mb-0">
            افزودن فرمول کلی
          </button>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E8E8E8] px-4 py-3 flex items-center gap-2">
        <Button
          onClick={handleStub}
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: '#1758BA',
            fontWeight: 700,
            fontSize: 15,
            borderRadius: '10px',
            height: 48,
            boxShadow: 'none',
            flex: 1,
            '&:hover': { backgroundColor: '#134a9e' },
          }}>
          ثبت نهایی
        </Button>

        <IconButton
          onClick={handleStub}
          sx={{
            height: 48,
            width: 48,
            borderRadius: '10px',
            backgroundColor: '#F7F7FF',
            flexShrink: 0,
            border: 'none',
          }}>
          <IoSettingsOutline color="#1758BA" />
        </IconButton>

        <IconButton
          onClick={handleStub}
          sx={{
            height: 48,
            width: 48,
            borderRadius: '10px',
            backgroundColor: '#F7F7FF',
            flexShrink: 0,
            border: 'none',
          }}>
          <CodiconEye color="#1758BA" />
        </IconButton>
      </div>
    </PageContainer>
  );
}
