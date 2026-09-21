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

function readStoredResults(): Result | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const raw = localStorage.getItem('Show_Solo_Result');
    return raw ? (JSON.parse(raw) as Result) : undefined;
  } catch {
    return undefined;
  }
}

const ResultsPage = () => {
  // Sync init — avoids empty first paint / Strict Mode race with localStorage
  const [results, setResults] = useState<Result | undefined>(readStoredResults);
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
    const parsed = readStoredResults();
    if (parsed) setResults(parsed);
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
      {/* Header — direct child of PageContainer flex column */}
      <div className="shrink-0 m-2 p-4 z-10 w-[calc(100%-16px)] h-[52px] flex items-center justify-center rounded-lg bg-[#F7F7FF] relative">
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

      {/* Scrollable report — pb so content clears the fixed footer */}
      <div className="overflow-y-auto w-full flex flex-col items-center px-8 pt-4 pb-32 flex-1 min-h-0">
        <HtmlPreview html={html} />

        {/* ALT 1 — Inline under report */}
        <div className="mt-8 mb-2 flex justify-center w-full shrink-0">
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

        {/* ALT 2 — Outlined under report */}
        <Button
          fullWidth
          variant="outlined"
          onClick={handleBack}
          sx={{
            mt: 2,
            mb: 4,
            maxWidth: 420,
            height: '52px',
            borderRadius: '10px',
            fontWeight: 700,
            color: '#1758BA',
            borderColor: '#1758BA',
            shrink: 0,
          }}
        >
          بازگشت به صفحه قبل (ALT2)
        </Button>
      </div>

      {/*
        PRIMARY — fixed to the viewport so PageContainer overflow-hidden
        cannot clip it (that was why buttons were invisible).
      */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[100] border-t border-[#EEF0F4] bg-white px-4 py-3"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
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
