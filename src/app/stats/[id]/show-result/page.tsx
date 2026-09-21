'use client';

import { Button, IconButton, Skeleton } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import HtmlPreview from '@/components/HtmlPreview/HtmlPreview';
import PageContainer from '@/templates/layout/PageContainer';

interface ResultRow {
  row: string;
}
interface Result {
  resultRows: ResultRow[];
}

const ResultsPage = () => {
  const router = useRouter();
  const params = useParams();
  const [results, setResults] = useState<Result[]>([]);
  const [ready, setReady] = useState(false);

  const searchParams = useSearchParams();
  const search = searchParams.get('name');
  const formId = params?.id?.toString();

  const backHref = search
    ? `/stats/${formId}?name=${encodeURIComponent(search)}`
    : `/stats/${formId}`;

  useEffect(() => {
    const storedResults = localStorage.getItem('testResult');
    if (!storedResults) {
      setReady(true);
      return;
    }

    try {
      setResults(JSON.parse(storedResults));
    } catch (e) {
      console.error('Invalid testResult:', e);
      setResults([]);
    } finally {
      setReady(true);
    }

    return () => {
      localStorage.removeItem('testResult');
    };
  }, []);

  const html = useMemo(() => {
    return results
      .map((result) => {
        if (!result.resultRows?.length) return '';

        return result.resultRows
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
      })
      .join(' ');
  }, [results]);

  return (
    <PageContainer>
      <div className="shrink-0 m-2 p-4 z-10 w-[calc(100%-16px)] h-[52px] flex items-center justify-center rounded-lg bg-[#F7F7FF] mb-2 relative">
        <IconButton
          onClick={() => router.replace(backHref)}
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
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto w-full flex flex-col items-center px-4 sm:px-8 py-4">
        {!ready ? (
          <div className="w-full flex flex-col items-center gap-3">
            <Skeleton variant="rounded" width="100%" height={28} animation="wave" />
            <Skeleton variant="rounded" width="92%" height={28} animation="wave" />
            <Skeleton variant="rounded" width="88%" height={28} animation="wave" />
            <Skeleton variant="rounded" width="95%" height={120} animation="wave" />
          </div>
        ) : (
          <HtmlPreview html={html as any} />
        )}
      </div>

      <div className="shrink-0 border-t border-[#EEF0F4] bg-white px-4 py-3 flex justify-center">
        <Button
          variant="contained"
          onClick={() => router.replace(backHref)}
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
    </PageContainer>
  );
};

export default ResultsPage;
