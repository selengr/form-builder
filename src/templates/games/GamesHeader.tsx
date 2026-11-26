'use client';

import { useRouter } from 'next/navigation';
import { IconButton } from '@mui/material';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';

export default function GamesHeader({
  title,
  backHref = '/',
}: {
  title: string;
  backHref?: string;
}) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-1 w-full mb-3">
      <IconButton
        onClick={() => router.push(backHref)}
        aria-label="بازگشت"
        sx={{ width: 40, height: 40 }}>
        <MdOutlineKeyboardArrowRight size={24} color="#292D32" />
      </IconButton>
      <h1 className="text-[18px] font-bold text-[#161616]">{title}</h1>
    </div>
  );
}
