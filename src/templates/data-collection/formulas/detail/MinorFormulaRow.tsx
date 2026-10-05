'use client';

import { Fragment, MouseEvent, useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Button, Menu, Typography } from '@mui/material';
import { SlPencil } from 'react-icons/sl';
import { WeuiDeleteOutlined } from '@/../public/images/icons/DeleteIcon';
import { IonCopyOutline } from '@/../public/images/icons/CopyIcon';
import { PhDotsThreeVerticalBold } from '@/../public/images/icons/PhDotsThreeVerticalBold';

const ORDINAL_WORDS = ['اول', 'دوم', 'سوم', 'چهارم', 'پنجم', 'ششم', 'هفتم', 'هشتم', 'نهم', 'دهم'];

function getOrdinalLabel(index: number) {
  const word = ORDINAL_WORDS[index];
  if (word) return `فرمول ${word}`;
  return `فرمول ${(index + 1).toLocaleString('fa-IR')}`;
}

function MinorFormulaMenu() {
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

  return (
    <Fragment>
      <button
        type="button"
        onClick={handleClick}
        className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-[10px] hover:bg-[#F7F7FF] transition-colors z-50"
        style={{ left: 9 }}
        aria-label="منو">
        <PhDotsThreeVerticalBold color="#9EA3AC" fontSize="1.5rem" />
      </button>

      {open && (
        <Menu
          sx={{
            '& .MuiPaper-root.MuiPaper-elevation': {
              borderRadius: '15px',
            },
            '& .MuiPaper-root': {
              touchAction: 'none',
              width: '125px',
            },
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}>
          <Button
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              color: '#222',
              paddingX: '10px',
            }}
            fullWidth
            onClick={handleStub}>
            <Typography fontSize={12}>تکثیر</Typography>
            <IonCopyOutline width={18} height={18} />
          </Button>
          <Button
            sx={{
              paddingX: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              color: '#1758BA',
            }}
            fullWidth
            onClick={handleStub}>
            <Typography fontSize={12}>ویرایش</Typography>
            <SlPencil size="1.15rem" />
          </Button>
          <Button
            sx={{
              paddingX: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              color: '#FA4D56',
            }}
            fullWidth
            onClick={handleStub}>
            <Typography fontSize={12}>حذف</Typography>
            <WeuiDeleteOutlined width={20} height={20} />
          </Button>
        </Menu>
      )}
    </Fragment>
  );
}

interface MinorFormulaRowProps {
  index: number;
}

export default function MinorFormulaRow({ index }: MinorFormulaRowProps) {
  const persianNumber = (index + 1).toLocaleString('fa-IR');

  return (
    <div
      dir="rtl"
      className="relative flex items-center w-full h-[54px] shrink-0 pl-12 border border-[#DDE1E6] rounded-xl bg-white"
      style={{ paddingRight: 11 }}>
      <Image
        src="/images/home-page/menu.svg"
        width={8}
        height={24}
        alt=""
        aria-hidden
        unoptimized
        className="absolute top-1/2 -translate-y-1/2"
        style={{ right: -1 }}
      />

      <span className="text-[#9EA3AC] font-medium text-[13px] w-5 text-center shrink-0">
        {persianNumber}
      </span>

      <span
        className="rounded-[10px] h-9 w-9 flex justify-center items-center shrink-0 bg-[#F7F7FF]"
        style={{ marginRight: 1 }}>
        <Image src="/images/home-page/text-block.svg" width={28} height={28} alt="" unoptimized />
      </span>

      <p
        className="flex-1 min-w-0 text-[13px] text-[#161616] truncate"
        style={{ marginRight: 10 }}>
        {getOrdinalLabel(index)}
      </p>

      <MinorFormulaMenu />
    </div>
  );
}
