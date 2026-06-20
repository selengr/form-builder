'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Button, IconButton } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import { useSearchParams } from 'next/navigation';
// images
import BugIcon from '@/../public/images/home-page/menu/bugIcon.svg';
// hooks
import { useReportFlow } from '@/hooks/useReportFlow';
// components
import LoginWithPhone from '@/components/common/loginWithPhone';
import ReportDialog from '@/components/ReportDialog/ReportDialog';
import HtmlPreview from '@/components/HtmlPreview/HtmlPreview';
import PageContainer from '@/templates/layout/PageContainer';

interface ResultRow {
  row: string;
}
interface Result {
  formId: string;
  resultRows: ResultRow[];
}

const ResultsPage = () => {
  const [results, setResults] = useState<Result>();
  const {
    dialogState,
    formValue,
    error,
    helperText,
    handleChange,
    handleReportDialog,
    handleLoginSubmit,
    handleCloseReport,
    setDialogState,
  } = useReportFlow();

  const searchParams = useSearchParams();
  const search = searchParams.get('name');

  useEffect(() => {
    const storedResults = localStorage.getItem('Show_Solo_Result');
    if (storedResults) {
      try {
        const parsed: Result = JSON.parse(storedResults);
        setResults(parsed);
      } catch (err) {
        console.error('Failed to parse stored results:', err);
      }
    }
    return () => {
      localStorage.removeItem('Show_Solo_Result');
    };
  }, []);

  const html = useMemo(() => {
    if (!results?.resultRows?.length) return "";

    return results.resultRows
      .map(({ row }) => {
        try {
          const parsed = JSON.parse(row);
          if (typeof parsed === "string") return parsed;
          if (parsed && typeof parsed === "object" && typeof parsed.html === "string") return parsed.html;
          return String(parsed.content ?? "");
        } catch {
          return row;
        }
      })
      .join(" ");
  }, [results]);

  return (
    <PageContainer>
      <div className={`flex flex-col bg-white rounded-xl overflow-hidden min-h-fit`}>

        <div className='shrink-0 m-2 p-4 z-10 w-[calc(100%-16px)]  h-[52px] flex items-center justify-center rounded-lg bg-[#F7F7FF] mb-4 relative'>
          <Link href={`/`} className='absolute right-1 md:right-4'>
            <IconButton
              sx={{
                borderRadius: '9999px',
              }}>
              <IoIosArrowForward fontSize='1.1rem' color='#000' />
            </IconButton>
          </Link>
          <p
            className="mx-5 px-8 text-sm md:text-base font-semibold md:font-bold text-[#161616] text-center truncate max-w-full"
          >گزارش فرم {search ?? '---'}</p>
          <Button
            onClick={handleReportDialog}
            size='medium' className='rounded-full'

            sx={{ position: 'absolute', right: { xs: '2px', sm: '8px' }, top: '50%', transform: 'translateY(-50%)' }}
            endIcon={
              <div className="relative w-[18px] h-[18px] sm:w-[24px] sm:h-[24px]">
                <Image
                  alt="report"
                  src={BugIcon}
                  fill
                  className="object-contain"
                />
              </div>
            }>
            <span className='text-xs'>گزارش</span>
          </Button>
        </div>
      </div>

      <div className="overflow-y-auto w-full flex flex-col items-center p-8">
        <HtmlPreview html={html} />
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
          onSubmit={handleLoginSubmit}
        />
      )}

      {/* دیالوگ گزارش */}
      {dialogState === 'report' && (
        <ReportDialog
          userPhone={formValue}
          open
          onClose={handleCloseReport}
          formId={results?.formId}
          typeOfReport={'RESULT_REPORT'}
          resultReportText={html}
        />
      )}
    </PageContainer>
  );
};

export default ResultsPage;
