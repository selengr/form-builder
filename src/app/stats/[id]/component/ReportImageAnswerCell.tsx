'use client';

import Image from 'next/image';
import { useState } from 'react';
import { IoSearch } from 'react-icons/io5';
import {
  fileManagerDownloadUrl,
  isEmptyMediaAnswer,
  resolveMediaAnswerRaw,
} from '@/lib/reportMediaAnswer';
import ReportImageAnswerDialog from './ReportImageAnswerDialog';

interface ReportImageAnswerCellProps {
  answer: unknown;
  downloadLink?: string;
  respondentName?: string;
}

export default function ReportImageAnswerCell({
  answer,
  downloadLink,
  respondentName,
}: ReportImageAnswerCellProps) {
  const raw = resolveMediaAnswerRaw(answer, downloadLink);
  const [open, setOpen] = useState(false);

  if (isEmptyMediaAnswer(raw)) {
    return null;
  }

  const imageUrl = fileManagerDownloadUrl(raw);
  if (!imageUrl) {
    return null;
  }

  return (
    <>
      <div className="flex justify-center items-center py-1">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="مشاهده تصویر پاسخ"
          className="group relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl border-2 border-transparent bg-[#F3F5F9] shadow-[0_1px_3px_rgba(16,24,40,0.08)] transition-colors hover:border-[#1758BA] focus-visible:border-[#1758BA] focus-visible:outline-none"
        >
          <Image
            src={imageUrl}
            alt=""
            fill
            unoptimized
            className="object-cover"
            sizes="72px"
          />
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#0f172a]/45 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            <IoSearch size={22} color="#fff" />
          </span>
        </button>
      </div>

      <ReportImageAnswerDialog
        open={open}
        onClose={() => setOpen(false)}
        imageUrl={imageUrl}
        rawAnswer={raw}
        respondentName={respondentName}
      />
    </>
  );
}