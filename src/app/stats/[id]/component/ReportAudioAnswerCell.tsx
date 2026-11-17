'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { IoPause, IoPlay, IoWarningOutline } from 'react-icons/io5';
import AudioDownloadIcon from '@/../public/images/home-page/audio-download.png';
import {
  fileManagerDownloadUrl,
  fileNameFromDownloadPath,
  formatBytesFa,
  isEmptyMediaAnswer,
  resolveMediaAnswerRaw,
} from '@/lib/reportMediaAnswer';

const PRIMARY = '#1758BA';

interface ReportAudioAnswerCellProps {
  answer: unknown;
  downloadLink?: string;
}

function formatTimeFa(seconds: number) {
  const whole = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0));
  const m = Math.floor(whole / 60);
  const s = whole % 60;
  const fmt = (n: number) => n.toLocaleString('fa-IR', { minimumIntegerDigits: 2, useGrouping: false });
  return `${fmt(m)}:${fmt(s)}`;
}

function displayFileName(raw: string) {
  const name = fileNameFromDownloadPath(raw);
  if (!name || name === 'تصویر_پاسخ') return 'فایل_صوتی';
  return name;
}

export default function ReportAudioAnswerCell({ answer, downloadLink }: ReportAudioAnswerCellProps) {
  const raw = resolveMediaAnswerRaw(answer, downloadLink);
  const isEmpty = isEmptyMediaAnswer(raw);
  const audioUrl = isEmpty ? '' : fileManagerDownloadUrl(raw);
  const fileName = displayFileName(raw);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    if (!audioUrl) return;
    let cancelled = false;
    fetch(audioUrl, { method: 'HEAD' })
      .then((res) => {
        if (cancelled || !res.ok) return;
        const length = res.headers.get('content-length');
        if (length) setFileSize(Number(length));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [audioUrl]);

  if (isEmpty || !audioUrl) {
    return null;
  }

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || unavailable) return;
    if (audio.paused) {
      audio.play().catch(() => setUnavailable(true));
    } else {
      audio.pause();
    }
  };

  const seek = (event: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || unavailable || !duration) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (rect.right - event.clientX) / rect.width;
    audio.currentTime = Math.max(0, Math.min(duration, ratio * duration));
  };

  const handleDownload = () => {
    if (unavailable) return;
    window.open(audioUrl, '_blank', 'noopener,noreferrer');
  };

  const progress = duration > 0 ? Math.min(100, (current / duration) * 100) : 0;

  return (
    <div
      className={`w-full min-w-[280px] max-w-[340px] rounded-[14px] px-3 py-2 text-right ${
        unavailable
          ? 'border border-[#FECDCA] bg-[#FEF3F2]'
          : playing
            ? 'border border-[#1758BA] bg-[#EEF4FF]'
            : 'border border-[#E4E7EC] bg-white'
      }`}
      dir="rtl"
    >
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        onLoadedMetadata={(e) => {
          const d = e.currentTarget.duration;
          if (Number.isFinite(d) && d > 0) setDuration(d);
        }}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onError={() => setUnavailable(true)}
      />

      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className={`min-w-0 truncate text-[13px] font-semibold ${unavailable ? 'text-[#98A2B3]' : 'text-[#161616]'}`}>
          {fileName}
        </span>
        <span className="shrink-0 text-[11px] text-[#667085]">
          {fileSize != null ? formatBytesFa(fileSize) : '—'}
        </span>
      </div>

      {unavailable ? (
        <div className="flex items-center justify-center gap-1.5 py-2 text-[#D92D20]">
          <IoWarningOutline size={16} />
          <span className="text-[12px] font-semibold">فایل در دسترس نیست</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? 'توقف' : 'پخش'}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: PRIMARY }}
          >
            {playing ? <IoPause size={15} /> : <IoPlay size={15} className="mr-px" />}
          </button>

          <div
            role="presentation"
            className="relative h-[3px] min-w-0 flex-1 cursor-pointer rounded-full bg-[#D0D5DD]"
            onClick={seek}
          >
            <div
              className="absolute inset-y-0 right-0 rounded-full"
              style={{ width: `${progress}%`, backgroundColor: PRIMARY }}
            />
          </div>

          <span
            className="shrink-0 text-[9px] leading-none text-[#98A2B3]"
            dir="ltr"
            style={{ letterSpacing: '-0.06em', fontVariantNumeric: 'tabular-nums' }}
          >
            {formatTimeFa(current)}/{formatTimeFa(duration)}
          </span>

          <button
            type="button"
            onClick={handleDownload}
            aria-label="دانلود"
            className="flex h-7 w-7 shrink-0 items-center justify-center"
          >
            <Image src={AudioDownloadIcon} alt="" width={18} height={18} unoptimized />
          </button>
        </div>
      )}
    </div>
  );
}