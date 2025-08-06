import { Button, IconButton } from '@mui/material';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import Image from 'next/image';
import BugIcon from '@/../public/images/home-page/menu/bugIcon.svg';
import React from 'react';

interface HeaderProps {
  handleOpenReportDialog: any;
  replace: any;
  formName: string;
}

export function Header({ handleOpenReportDialog, replace, formName }: HeaderProps) {
  return (
    <div className='shrink-0 flex items-center justify-center gap-4 bg-[#F7F7FF] rounded-lg px-4 py-4 mb-4 relative m-2 z-10'>
      <IconButton sx={{ position: 'absolute', left: '8px' }} onClick={() => replace('/')}>
        <MdOutlineKeyboardArrowRight color='#292D32' />
      </IconButton>

      <p className='text-base font-bold text-[#161616] text-center mx-7'>{formName}</p>

      <Button onClick={handleOpenReportDialog} size='medium' className='rounded-full' sx={{ position: 'absolute', right: '8px' }} endIcon={<Image alt='report' src={BugIcon} height={24} width={24} />}>
        <span className='text-xs'>گزارش</span>
      </Button>
    </div>
  );
}

export default Header;
