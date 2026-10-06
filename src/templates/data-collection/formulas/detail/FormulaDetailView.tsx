'use client';

import clsx from 'clsx';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Box, Button, IconButton, Skeleton } from '@mui/material';
import { IoIosArrowForward } from 'react-icons/io';
import { IoSettingsOutline } from 'react-icons/io5';
import { CodiconEye } from '@/../public/images/home-page/EyeIcon';
import { useGetMinorFormulaList } from './useGetMinorFormulaList';
import MinorFormulaRow from './MinorFormulaRow';
import MinorFormulaDialog from '../minor-formula/MinorFormulaDialog';

const APP_SIDEBAR_WIDTH_PX = 500;
const DESKTOP_MEDIA = '@media (min-width:1280px)';

interface FormulaDetailViewProps {
  majorId: string;
  majorName: string;
}

export default function FormulaDetailView({ majorId, majorName }: FormulaDetailViewProps) {
  const router = useRouter();
  const [openMinorFormulaDialog, setOpenMinorFormulaDialog] = useState(false);
  const { minorList, isLoading, isError, error } = useGetMinorFormulaList(majorId);

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
          <Box
            className="bg-white w-full h-full flex flex-col overflow-hidden"
            sx={{ borderRadius: '12px', [DESKTOP_MEDIA]: { borderRadius: '16px' } }}>
            <div className="flex-1 overflow-y-auto min-h-0">
              <Box
                className="w-full h-full flex flex-col"
                sx={{
                  paddingX: '8px',
                  paddingTop: '8px',
                  [DESKTOP_MEDIA]: { padding: 0 },
                }}>
                <div
                  dir="rtl"
                  className="hidden lg:flex items-center justify-between w-full pb-5 shrink-0"
                  style={{ paddingTop: 18, paddingLeft: 16, paddingRight: 45 }}>
                  <h1 className="text-[16px] font-bold text-[#161616] truncate max-w-[325px]">
                    {title}
                  </h1>

                  <div className="flex items-center" style={{ gap: 12 }}>
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

                <Box
                  className="flex flex-col flex-1 min-h-0"
                  sx={{
                    paddingBottom: '96px',
                    [DESKTOP_MEDIA]: { paddingBottom: '20px', paddingLeft: '20px', paddingRight: '28px' },
                  }}>
                  <div
                    dir="rtl"
                    className="flex flex-col w-full h-full min-h-0 rounded-[20px] border border-[#DDE1E6] bg-[#F8FAFC] overflow-hidden">
                    <div
                      className="flex flex-col w-full flex-1 min-h-0 overflow-y-auto"
                      style={{ scrollbarWidth: 'thin', padding: '11px 10px 0', gap: 7 }}>
                      {isLoading &&
                        Array.from({ length: 2 }).map((_, index) => (
                          <Skeleton
                            key={index}
                            variant="rounded"
                            animation="wave"
                            height={54}
                            sx={{ borderRadius: '12px', flexShrink: 0 }}
                          />
                        ))}

                      {isError && (
                        <p className="p-3 text-[#6F6F6F] text-center text-sm font-medium">
                          {(error as Error)?.message || 'خطا در دریافت لیست فرمول‌های جزئی'}
                        </p>
                      )}

                      {!isLoading && !isError && minorList.length === 0 && (
                        <p className="p-3 text-[#6F6F6F] text-center text-sm font-medium">
                          هیچ فرمول جزئی ثبت نشده است
                        </p>
                      )}

                      {minorList.map((item, index) => (
                        <MinorFormulaRow key={item.id} index={index} />
                      ))}

                      <div
                        onClick={() => setOpenMinorFormulaDialog(true)}
                        className="flex items-center justify-center rounded-xl border border-dashed border-[#DDE1E6] bg-transparent min-h-[56px] cursor-pointer shrink-0">
                        <p className="p-3 text-[#6F6F6F] text-center text-sm font-medium cursor-pointer">
                        افزودن فرمول جزئی
                        </p>
                      </div>
                    </div>

                    {/* <div
                      onClick={handleStub}
                      className="flex items-center justify-center rounded-xl border border-dashed border-[#DDE1E6] bg-transparent min-h-[56px] cursor-pointer shrink-0"
                      style={{ margin: '8px 10px 10px' }}>
                      <p className="p-3 text-[#6F6F6F] text-center text-sm font-medium cursor-pointer">
                        افزودن فرمول کلی
                      </p>
                    </div> */}
                  </div>
                </Box>

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
              </Box>
            </div>
          </Box>
        </div>
      </main>

      <MinorFormulaDialog
        open={openMinorFormulaDialog}
        onClose={() => setOpenMinorFormulaDialog(false)}
        majorId={majorId}
      />
    </div>
  );
}
