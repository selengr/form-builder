'use client';

import { Grid2, Skeleton } from '@mui/material';

export default function PackagingRequestListCardSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <Grid2 key={index} sx={{ width: 1, mx: 'auto', maxWidth: '470px' }} size={12}>
          <div className="relative flex flex-col gap-3 rounded-2xl border border-[#DDE1E6] p-5 shadow-sm">
            <div className="absolute top-[20px] left-6 flex items-center gap-2">
              <Skeleton variant="circular" width={24} height={24} animation="wave" />
              <Skeleton variant="circular" width={24} height={24} animation="wave" />
            </div>

            <Skeleton variant="text" width="70%" height={28} animation="wave" />
            <Skeleton variant="text" width="45%" height={26} animation="wave" />
          </div>
        </Grid2>
      ))}
    </>
  );
}
