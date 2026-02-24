'use client';
import Link from 'next/link';
import Image from 'next/image';
import { IconButton } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import { useParams, useSearchParams } from 'next/navigation';
import HtmlPreview from '@/components/HtmlPreview/HtmlPreview';

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
    const storedResults = localStorage.getItem('testResult');
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    }
  }, []);


  const html = useMemo(() => {
    return results?.map((result, index) => {
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
  }, [results]);


  return (
    <div className='w-full min-h-screen h-full px-4 py-4 bg-[#f7f7f7]'>
      <div className='md:container mx-auto flex p-3 flex-col justify-start items-center min-w-screen h-full bg-white rounded-xl w-full '>
        <div className='relative flex w-full justify-center items-center min-h-[52px] h-[52px] rounded-lg bg-[#F7F7FF]'>
          <Link href={`/stats/${id}`} className='absolute right-4'>
            <IconButton
              sx={{
                borderRadius: '9999px',
              }}>
              <IoIosArrowForward fontSize='1.1rem' color='#000' />
            </IconButton>
          </Link>
          <span className='text-[#161616]'>گزارش فرم {search ?? '---'}</span>
        </div>

        <div className="overflow-y-auto w-full flex flex-col items-center p-8">
          <HtmlPreview html={html as any} />
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
