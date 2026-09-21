'use client';

import Image from 'next/image';
import { Button, IconButton } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { IoIosArrowForward } from 'react-icons/io';
import React, { useEffect, useMemo, useState } from 'react';
// images
import BugIcon from '@/../public/images/home-page/menu/bugIcon.svg';
// hooks
import { useReportFlow } from '@/hooks/useReportFlow';
// components
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

const BACK_HREF = '/my-assessments';

const ResultsPage = () => {
  const { replace } = useRouter();
  const [results, setResults] = useState<Result>();
  const {
    dialogState,
    handleReportDialog,
    handleCloseReport,
  } = useReportFlow();

  const searchParams = useSearchParams();
  const search = searchParams.get('name');

  useEffect(() => {
    const storedResults = localStorage.getItem('Show_User_Solo_Result');
    if (storedResults) {
      try {
        const parsed: Result = JSON.parse(storedResults);
        setResults(parsed);
      } catch (err) {
        console.error('Failed to parse stored results:', err);
      }
    }
    return () => {
      localStorage.removeItem('Show_User_Solo_Result');
    };
  }, []);

  const html = useMemo(() => {
    if (!results?.resultRows?.length) return '';

    return results.resultRows
      .map(({ row }) => {
        try {
          const parsed = JSON.parse(row);
          if (typeof parsed === 'string') return parsed;
          if (parsed && typeof parsed === 'object' && typeof parsed.html === 'string') return parsed.html;
          return String(parsed.content ?? '');
        } catch {
          return row;
        }
      })
      .join(' ');
  }, [results]);

  return (
    <PageContainer>
      <div className="shrink-0 m-2 p-4 z-10 w-[calc(100%-16px)] h-[52px] flex items-center justify-center rounded-lg bg-[#F7F7FF] mb-2 relative">
        <IconButton
          onClick={() => replace(BACK_HREF)}
          sx={{
            position: 'absolute',
            left: { xs: '2px', sm: '8px' },
            top: '50%',
            transform: 'translateY(-50%)',
            borderRadius: '9999px',
          }}
        >
          <IoIosArrowForward fontSize="1.1rem" color="#000" />
        </IconButton>
        <p className="mx-5 px-8 text-sm md:text-base font-semibold md:font-bold text-[#161616] text-center truncate max-w-full">
          گزارش فرم {search ?? '---'}
        </p>
        <Button
          onClick={handleReportDialog}
          size="medium"
          className="rounded-full"
          sx={{ position: 'absolute', right: { xs: '2px', sm: '8px' }, top: '50%', transform: 'translateY(-50%)' }}
          endIcon={
            <div className="relative w-[18px] h-[18px] sm:w-[24px] sm:h-[24px]">
              <Image
                alt="report"
                src={BugIcon}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          }
        >
          <span className="text-xs">گزارش</span>
        </Button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto w-full flex flex-col items-center px-4 sm:px-8 py-4">
        <HtmlPreview html={html} />
      </div>

      <div className="shrink-0 border-t border-[#EEF0F4] bg-white px-4 py-3 flex justify-center">
        <Button
          variant="contained"
          onClick={() => replace(BACK_HREF)}
          sx={{
            width: '150px',
            height: '52px',
            borderRadius: '10px',
            backgroundColor: '#1758BA',
            boxShadow: 'none',
            fontWeight: 700,
            '&:hover': {
              backgroundColor: '#1758BA',
              boxShadow: 'none',
            },
          }}
        >
          بازگشت
        </Button>
      </div>

      {dialogState === 'report' && (
        <ReportDialog
          open
          onClose={handleCloseReport}
          formId={results?.formId}
          typeOfReport="RESULT_REPORT"
          resultReportText={html}
        />
      )}
    </PageContainer>
  );
};

export default ResultsPage;
