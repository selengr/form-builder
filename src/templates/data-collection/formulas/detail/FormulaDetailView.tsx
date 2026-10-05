'use client';

import clsx from 'clsx';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button, IconButton } from '@mui/material';
import { IoIosArrowForward } from 'react-icons/io';
import { IoSettingsOutline } from 'react-icons/io5';
import { CodiconEye } from '@/../public/images/home-page/EyeIcon';
import { useGetMinorFormulaList } from './useGetMinorFormulaList';
import MinorFormulaRow from './MinorFormulaRow';
import { MinorFormulaListItem } from './types';

const APP_SIDEBAR_WIDTH_PX = 500;

interface FormulaDetailViewProps {
  majorId: string;
  majorName: string;
}

const TEMP_FAKE_MINOR_ITEMS: MinorFormulaListItem[] = [
  {
    id: -1,
    majorId: 0,
    formulaModel: {
      formId: 0,
      formula: '',
      condition: { type: 'condition', field: '', operator: 'EQUAL', value: '' },
    },
  },
  {
    id: -2,
    majorId: 0,
    formulaModel: {
      formId: 0,
      formula: '',
      condition: { type: 'condition', field: '', operator: 'EQUAL', value: '' },
    },
  },
];

export default function FormulaDetailView({ majorId, majorName }: FormulaDetailViewProps) {
  const router = useRouter();
  useGetMinorFormulaList(majorId);
  const minorList = TEMP_FAKE_MINOR_ITEMS;

  const handleStub = () => {
    toast.info('این قابلیت به‌زودی اضافه می‌شود');
  };

  const title = majorName || 'فرمول';

  return (
    <div
      dir="ltr"
      className="flex w-full mx-auto overflow-hidden xs:h-[calc(100dvh-5rem)] md:h-[100dvh]">
      <main className="flex flex-col w-full h-full overflow-hidden">
        <div className="flex w-full px-3 py-2 lg:p-4 items-start justify-center relative flex-1 overflow-hidden">
          <div className="bg-white w-full h-full rounded-xl lg:rounded-2xl flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="w-full h-full flex flex-col px-2 pt-2 lg:p-0">
                <div
                  dir="rtl"
                  className="hidden lg:flex items-center justify-between w-full pt-[18px] pb-5 pl-4 pr-[45px] shrink-0">
                  <h1 className="text-[16px] font-bold text-[#161616] truncate max-w-[325px]">
                    {title}
                  </h1>

                  <div className="flex items-center gap-3">
                    <IconButton
                      onClick={handleStub}
                      sx={{
                        height: 34,
                        width: 34,
                        padding: '5px',
                        border: 'none',
                        borderRadius: '8px',
                        backgroundColor: '#F7F7FF',
                      }}>
                      <CodiconEye color="#1758BA" className="p-0" />
                    </IconButton>

                    <IconButton
                      onClick={handleStub}
                      sx={{
                        height: 34,
                        width: 34,
                        padding: '5px',
                        border: 'none',
                        borderRadius: '8px',
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
                        borderRadius: '14px',
                        height: 36,
                        minWidth: 154,
                        boxShadow: 'none',
                        '&:hover': { backgroundColor: '#134a9e' },
                      }}>
                      ثبت نهایی
                    </Button>
                  </div>
                </div>

                <div
                  dir="rtl"
                  className="flex lg:hidden items-center justify-between w-full px-1 pb-3 shrink-0 relative">
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

                <div className="flex flex-col flex-1 min-h-0 pb-24 lg:pb-5 lg:pl-5 lg:pr-7">
                  <div
                    dir="rtl"
                    className="flex flex-col w-full h-full min-h-0 rounded-[20px] border border-[#DDE1E6] bg-[#F8FAFC] overflow-hidden">
                    <div
                      className="flex flex-col w-full flex-1 min-h-0 overflow-y-auto px-[10px] pt-[11px] gap-[7px]"
                      style={{ scrollbarWidth: 'thin' }}>
                      {minorList.map((item, index) => (
                        <MinorFormulaRow key={item.id} index={index} />
                      ))}

                      <div
                        onClick={handleStub}
                        className="flex items-center justify-center rounded-xl border border-dashed border-[#DDE1E6] bg-transparent min-h-[56px] cursor-pointer shrink-0">
                        <p className="p-3 text-[#6F6F6F] text-center text-sm font-medium cursor-pointer">
                          افزودن فرمول جزئی
                        </p>
                      </div>
                    </div>

                    <div
                      onClick={handleStub}
                      className="mx-[10px] mb-[10px] mt-2 flex items-center justify-center rounded-xl border border-dashed border-[#DDE1E6] bg-transparent min-h-[56px] cursor-pointer shrink-0">
                      <p className="p-3 text-[#6F6F6F] text-center text-sm font-medium cursor-pointer">
                        افزودن فرمول کلی
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={clsx(
                    'lg:hidden fixed bottom-0 left-0 z-50 bg-white border-t border-[#E8E8E8] px-4 py-3 flex items-center gap-2',
                    'right-0 md:right-[var(--app-sidebar-width)]',
                  )}
                  style={{ ['--app-sidebar-width' as string]: `${APP_SIDEBAR_WIDTH_PX}px` }}>
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
                      height: { xs: 48, md: 32 },
                      width: { xs: 48, md: 32 },
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: { xs: '13px', md: '6px' },
                      border: 'none',
                      borderRadius: '10px',
                      backgroundColor: '#F7F7FF',
                    }}>
                    <IoSettingsOutline color="#1758BA" className="p-0" />
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
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
