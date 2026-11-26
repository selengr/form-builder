'use client';

import Link from 'next/link';
import { Button } from '@mui/material';
import GamesHeader from './GamesHeader';

export default function GameNotFound() {
  return (
    <div className="w-full max-w-[470px] mx-auto px-4 py-3">
      <GamesHeader title="بازی پیدا نشد" backHref="/games" />
      <p className="text-sm text-[#637381] mb-4">این بازی در کاتالوگ نیست یا آدرس اشتباه است.</p>
      <Link href="/games">
        <Button variant="contained" disableElevation sx={{ borderRadius: '12px', bgcolor: '#1758BA' }}>
          بازگشت به فهرست
        </Button>
      </Link>
    </div>
  );
}
