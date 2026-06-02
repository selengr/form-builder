'use client';
import Link from 'next/link';
import { IconButton } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import { useParams, useSearchParams } from 'next/navigation';
import HtmlPreview from '@/components/HtmlPreview/HtmlPreview';
import PageContainer from '@/templates/layout/PageContainer';

interface ResultRow {
  row: string;
}
interface Result {
  resultRows: ResultRow[];
}

const ResultsPage = () => {
  const { id } = useParams();
  const [results, setResults] = useState<Result[]>([]);

  const searchParams = useSearchParams();
  const search = searchParams.get('name');


  useEffect(() => {
    const storedResults = localStorage.getItem("testResult");
    if (!storedResults) return;

    try {
      setResults(JSON.parse(storedResults));
    } catch (e) {
      console.error("Invalid testResult:", e);
      setResults([]);
    }
    return () => {
      localStorage.removeItem("testResult");
    };
  }, []);


  const html = useMemo(() => {
    return results
      .map((result) => {
        if (!result.resultRows?.length) return "";

        return result.resultRows
          .map(({ row }) => {
            try {
              const parsed = JSON.parse(row);
              if (typeof parsed === "string") return parsed;
              if (parsed && typeof parsed === "object" && typeof parsed.html === "string") return parsed.html;
              return String(parsed ?? "");
            } catch {
              return row;
            }
          })
          .join(" ");
      })
      .join(" ");
  }, [results]);

  return (
    <PageContainer>
      <div className={`flex flex-col bg-white rounded-xl overflow-hidden min-h-fit`}>

        <div className='shrink-0 m-2 p-4 z-10 w-[calc(100%-16px)] h-[52px] flex items-center justify-center rounded-lg bg-[#F7F7FF] mb-4 relative'>

          <Link href={`/stats/${id}`} className='absolute right-2 md:right-4'>
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
        </div>
      </div>

      <div className="overflow-y-auto w-full flex flex-col items-center p-8">
        <HtmlPreview html={html as any} />
      </div>
    </PageContainer>
  );
};

export default ResultsPage;
