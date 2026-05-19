'use client';

import React from 'react';
import { Skeleton } from '@mui/material';

const ListCardSkeleton: React.FC = () => {
  return (
    <div
      className="
        border border-[#DDE1E6] 
        p-4 rounded-2xl 
        flex flex-col gap-4 
        w-full relative 
        bg-white
      "
    >
      <div className="flex flex-wrap gap-2 w-full items-center justify-between">
        <div className="flex-1 min-w-0">
          <Skeleton variant="text" width={70} height={22} />
          <Skeleton variant="text" width="60%" height={28} />
        </div>

        <Skeleton
          variant="rounded"
          width={96}
          height={36}
          sx={{ borderRadius: '8px' }}
        />
      </div>
    </div>
  );
};

export default ListCardSkeleton;
