import React from 'react';
import Image from 'next/image';
import { Button, IconButton } from '@mui/material';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import BugIcon from '@/../public/images/home-page/menu/bugIcon.svg';

interface HeaderProps {
  handleOpenReportDialog: any;
  replace: any;
  formName: string;
  surveyParam: boolean;
}

function Header({ handleOpenReportDialog, replace, formName, surveyParam }: HeaderProps) {
  return (
    <div className="shrink-0 relative m-2 mb-4 rounded-lg bg-[#F7F7FF] px-4 py-4 z-10">

      {!surveyParam && (
        <IconButton
          sx={{ position: 'absolute', left: { xs: '2px', sm: '8px' }, top: '50%', transform: 'translateY(-50%)' }}
          onClick={() => replace('/')}
        >
          <MdOutlineKeyboardArrowRight color="#292D32" />
        </IconButton>
      )}

      <Button
        onClick={handleOpenReportDialog}
        size="medium"
        className="rounded-full"
        sx={{ position: 'absolute', right: { xs: '2px', sm: '8px' }, top: '50%', transform: 'translateY(-50%)' }}
        endIcon={
          <div className="relative w-[18px] h-[18px] sm:w-[24px] sm:h-[24px]">
            <Image
              alt="report"
              src={BugIcon}
              fill
              className="object-contain"
            />
          </div>
        }
      >
        <span className="text-xs">گزارش</span>
      </Button>

      <div className={`${surveyParam ? "px-0" : "px-12"} mx-5 flex items-center justify-center`}>
        <p
          className="text-sm md:text-base font-semibold md:font-bold text-[#161616] text-center truncate max-w-full"
          title={formName}
        >
          {formName}
        </p>
      </div>
    </div>
  );
}

export default Header;
