'use client';

import { MouseEvent, useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { PhDotsThreeVerticalBold } from '@/../public/images/icons/PhDotsThreeVerticalBold';

const ORDINAL_WORDS = ['اول', 'دوم', 'سوم', 'چهارم', 'پنجم', 'ششم', 'هفتم', 'هشتم', 'نهم', 'دهم'];

function getOrdinalLabel(index: number) {
  const word = ORDINAL_WORDS[index];
  if (word) return `فرمول ${word}`;
  return `فرمول ${(index + 1).toLocaleString('fa-IR')}`;
}

interface MinorFormulaRowProps {
  index: number;
}

export default function MinorFormulaRow({ index }: MinorFormulaRowProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStub = () => {
    handleClose();
    toast.info('این قابلیت به‌زودی اضافه می‌شود');
  };

  const persianIndex = (index + 1).toLocaleString('fa-IR');

  return (
    <div
      dir="rtl"
      className="flex items-center gap-2 h-[65px] w-full border border-[#E8E8E8] rounded-xl bg-white px-3">
      <IconButton onClick={handleClick} size="small">
        <PhDotsThreeVerticalBold color="#1758BA" fontSize="1.4rem" />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleStub}>ویرایش</MenuItem>
        <MenuItem onClick={handleStub}>حذف</MenuItem>
      </Menu>

      <div className="flex-1" />

      <span className="text-sm text-[#161616]">{getOrdinalLabel(index)}</span>

      <span className="h-9 w-9 flex justify-center items-center shrink-0 rounded-[10px] border border-[#2CDFC9] text-[#2CDFC9] font-bold">
        T
      </span>

      <span className="text-[#9EA3AC] font-medium text-[13px] w-5 text-center shrink-0">
        {persianIndex}
      </span>

      <Image src="/images/home-page/menu.svg" width={14} height={14} alt="" />
    </div>
  );
}
