'use client';

import clsx from 'clsx';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, IconButton } from '@mui/material';
import { IoIosArrowForward } from 'react-icons/io';
import { IoSettingsOutline } from 'react-icons/io5';
import { CodiconEye } from '@/../public/images/home-page/EyeIcon';
import { useGetMinorFormulaList } from '../detail/useGetMinorFormulaList';
import MinorFormulaRow from '../detail/MinorFormulaRow';
import MinorFormulaRowSkeleton from '../detail/MinorFormulaRowSkeleton';
import { useGetMajorFormula } from '../detail/useGetMajorFormula';
import { parseFrontFormulaData } from '@/components/formula-calculator';
import { toCalculatorFields } from '../detail/utils/toCalculatorFields';
import SavedFormulaPreview from './SavedFormulaPreview';

const APP_SIDEBAR_WIDTH_PX = 500;
const DESKTOP_MEDIA = '@media (min-width:1280px)';

const disabledIconSx = {
  border: 'none',
  backgroundColor: '#F7F7FF',
  '&.Mui-disabled': { backgroundColor: '#F7F7FF', opacity: 0.5 },
};

interface FormulaViewDetailProps {
  majorId: string;
  majorName: string;
}

export default function FormulaViewDetail({ majorId, majorName }: FormulaViewDetailProps) {
  const router = useRouter();
  const { minorList, isLoading, isError, error } = useGetMinorFormulaList(majorId);
  const { majorFormula, isLoading: isMajorFormulaLoading } = useGetMajorFormula(majorId);
  const savedElements = useMemo(() => parseFrontFormulaData(majorFormula?.frontFormulaData), [majorFormula?.frontFormulaData]);
  const minorFields = useMemo(() => toCalculatorFields(minorList), [minorList]);

  const title = majorFormula?.majorName || majorName || 'فرمول';

  const handleEdit = () => {
    router.push(`/data-collection/formulas/${majorId}?name=${encodeURIComponent(majorName)}`);
  };

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
                      disabled
                      sx={{ ...disabledIconSx, height: 34, width: 34, padding: '5px', borderRadius: '8px' }}>
                      <CodiconEye color="#1758BA" className="p-0" />
                    </IconButton>

                    <IconButton
                      disabled
                      sx={{ ...disabledIconSx, height: 34, width: 34, padding: '5px', borderRadius: '8px' }}>
                      <IoSettingsOutline color="#1758BA" className="p-0" />
                    </IconButton>

                    <Button
                      onClick={handleEdit}
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
                      برو به ویرایش
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
                    [DESKTOP_MEDIA]: { paddingBottom: '20px', paddingLeft: '20px', paddingRight: '20px' },
                  }}>
                  <div
                    dir="rtl"
                    className="flex flex-col w-full h-full min-h-0 rounded-[20px] border border-[#DDE1E6] bg-[#F8FAFC] overflow-hidden">
                    <div
                      className="flex flex-col w-full flex-1 min-h-0 overflow-y-auto"
                      style={{ scrollbarWidth: 'thin', padding: '11px 10px', gap: 7 }}>
                      {isLoading &&
                        Array.from({ length: 2 }).map((_, index) => <MinorFormulaRowSkeleton key={index} />)}

                      {isError && (
                        <p className="p-3 text-[#6F6F6F] text-center text-sm font-medium">
                          {(error as Error)?.message || 'خطا در دریافت لیست فرمول‌های جزئی'}
                        </p>
                      )}

                      {!isLoading && !isError && minorList.length === 0 && (
                        <p className="p-3 text-[#6F6F6F] text-center text-sm font-medium">
                          هنوز هیچ فرمول جزئی‌ای برای این فرمول ساخته نشده است.
                        </p>
                      )}

                      {minorList.map((item, index) => (
                        <MinorFormulaRow key={item.id} index={index} name={item.minorName} readOnly />
                      ))}
                    </div>

                    <div
                      className="flex flex-col w-full shrink-0 overflow-y-auto"
                      style={{ maxHeight: '55%', scrollbarWidth: 'thin', padding: '12px 10px', borderTop: '1px solid #DDE1E6' }}>
                      <SavedFormulaPreview
                        elements={savedElements}
                        formula={majorFormula?.frontFormula ?? ''}
                        fields={minorFields}
                        isLoading={isMajorFormulaLoading}
                      />
                    </div>
                  </div>
                </Box>

                <div
                  className={clsx(
                    'lg:hidden fixed bottom-0 left-0 z-50 bg-white border-t border-[#E8E8E8] px-4 py-3 flex items-center gap-2',
                    'right-0 md:right-[var(--app-sidebar-width)]',
                  )}
                  style={{ ['--app-sidebar-width' as string]: `${APP_SIDEBAR_WIDTH_PX}px` }}>
                  <Button
                    onClick={handleEdit}
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
                    برو به ویرایش
                  </Button>

                  <IconButton
                    disabled
                    sx={{
                      ...disabledIconSx,
                      height: { xs: 48, md: 32 },
                      width: { xs: 48, md: 32 },
                      padding: { xs: '13px', md: '6px' },
                      borderRadius: '10px',
                    }}>
                    <IoSettingsOutline color="#1758BA" className="p-0" />
                  </IconButton>

                  <IconButton
                    disabled
                    sx={{ ...disabledIconSx, height: 48, width: 48, borderRadius: '10px', flexShrink: 0 }}>
                    <CodiconEye color="#1758BA" />
                  </IconButton>
                </div>
              </Box>
            </div>
          </Box>
        </div>
      </main>
    </div>
  );
}
