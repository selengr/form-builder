'use client';

import React from 'react';
import Image from 'next/image';
import { Box } from '@mui/material';
import formListEmpty from '@/../public/images/home-page/formListEmpty.png';

interface EmptyListProps {
  title?: string;
  containerHeight?: string | number;
}

const EmptyList: React.FC<EmptyListProps> = ({
  title = 'موردی یافت نشد',
  containerHeight = '100%',
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        height: containerHeight,
        width: '100%',
        textAlign: 'center',
        px: 2,
      }}
    >
      <div className="h-40 sm:h-52 md:h-56 w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px]">
        <Image
          src={formListEmpty}
          alt="empty-state"
          className="w-full h-full object-contain -mr-6"
          draggable={false}
          priority
        />
      </div>

      <span className="text-[#999] text-sm sm:text-base md:text-md">
        {title}
      </span>
    </Box>
  );
};

export default EmptyList;
