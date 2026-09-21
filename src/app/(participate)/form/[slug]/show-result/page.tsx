'use client';

import Image from 'next/image';
import { Button, IconButton } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import { useRouter, useSearchParams } from 'next/navigation';

// images
import BugIcon from '@/../public/images/home-page/menu/bugIcon.svg';

// hooks
import { useReportFlow } from '@/hooks/useReportFlow';

// components
import LoginWithPhone from '@/components/common/loginWithPhone';
import ReportDialog from '@/components/ReportDialog/ReportDialog';
import HtmlPreview from '@/components/HtmlPreview/HtmlPreview';
import PageContainer from '@/templates/layout/PageContainer';
import MresalatDialog from '../components/MresalatDialog';
import { useUserInfoContext } from '@/context/UserInfoContext';
import { getParticipateBackHref } from '../getParticipateBackHref';

interface ResultRow {
  row: string;
}

interface Result {
  formId: string;
  resultRows: ResultRow[];
}

const ResultsPage = () => {
  const [results, setResults] = useState<Result>();
  const [showMresalatDialog, setShowMresalatDialog] = useState(false);

  const router = useRouter();
  const { isAuthenticated } = useUserInfoContext();

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
  const backHref = getParticipateBackHref(
    searchParams.get('source'),
    searchParams.get('back'),
  );

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
    // Do NOT removeItem in cleanup — React Strict Mode remounts and would wipe
    // the report after a moment. Clear only when the user leaves (handleBack).
  }, []);

  useEffect(() => {
    if (isAuthenticated) return;

    const timer = setTimeout(() => {
      setShowMresalatDialog(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  const html = useMemo(() => {
    if (!results?.resultRows?.length) return '';

    return results.resultRows
      .map(({ row }) => {
        try {
          const parsed = JSON.parse(row);

          if (typeof parsed === 'string') return parsed;

          if (
            parsed &&
            typeof parsed === 'object' &&
            typeof parsed.html === 'string'
          ) {
            return parsed.html;
          }

          return String(parsed.content ?? '');
        } catch {
          return row;
        }
      })
      .join(' ');
  }, [results]);

  const handleBack = () => {
    localStorage.removeItem('Show_Solo_Result');
    router.replace(backHref);
  };

  return (
    <PageContainer>
      <div className="flex flex-col bg-white rounded-xl overflow-hidden min-h-0 flex-1">
        <div className="shrink-0 m-2 p-4 z-10 w-[calc(100%-16px)] h-[52px] flex items-center justify-center rounded-lg bg-[#F7F7FF] mb-4 relative">
          <IconButton
            aria-label="بازگشت"
            onClick={handleBack}
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
            sx={{
              position: 'absolute',
              right: { xs: '2px', sm: '8px' },
              top: '50%',
              transform: 'translateY(-50%)',
            }}
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

        <div className="overflow-y-auto w-full flex flex-col items-center p-8 flex-1 min-h-0">
          <HtmlPreview html={html} />

          {/* ALT 1 — Inline back under the report (like FinishStep) */}
          <div className="mt-8 mb-2 flex justify-center w-full">
            <Button
              variant="contained"
              onClick={handleBack}
              sx={{
                width: '150px',
                height: '52px',
                borderRadius: '10px',
                backgroundColor: '#1758BA',
                boxShadow: 'none',
                '&:hover': { backgroundColor: '#1758BA', boxShadow: 'none' },
              }}
            >
              بازگشت (ALT1)
            </Button>
          </div>

          {/* ALT 2 — Full-width outlined under HTML */}
          <Button
            fullWidth
            variant="outlined"
            onClick={handleBack}
            sx={{
              mt: 2,
              mb: 2,
              maxWidth: 420,
              height: '52px',
              borderRadius: '10px',
              fontWeight: 700,
              color: '#1758BA',
              borderColor: '#1758BA',
            }}
          >
            بازگشت به صفحه قبل (ALT2)
          </Button>
        </div>

        {/* PRIMARY — Sticky bottom bar */}
        <div className="shrink-0 border-t border-[#EEF0F4] bg-white px-4 py-3 safe-area-pb">
          <div className="mx-auto flex w-full max-w-md justify-center">
            <Button
              fullWidth
              variant="contained"
              onClick={handleBack}
              sx={{
                height: '52px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '15px',
                backgroundColor: '#1758BA',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#1758BA',
                  opacity: 0.92,
                  boxShadow: 'none',
                },
              }}
            >
              بازگشت (PRIMARY)
            </Button>
          </div>
        </div>
      </div>

      {dialogState === 'login' && (
        <LoginWithPhone
          open
          onClose={() => setDialogState('none')}
          label="شماره موبایل"
          placeholder="09129876543"
          formValue={formValue}
          error={error}
          helperText={helperText}
          onChange={handleChange}
          onSubmit={handleLoginSubmit}
        />
      )}

      {dialogState === 'report' && (
        <ReportDialog
          userPhone={formValue}
          open
          onClose={handleCloseReport}
          formId={results?.formId}
          typeOfReport="RESULT_REPORT"
          resultReportText={html}
        />
      )}

      <MresalatDialog
        open={showMresalatDialog}
        onClose={() => setShowMresalatDialog(false)}
      />
    </PageContainer>
  );
};

export default ResultsPage;
