'use client';

import { Grid2, Skeleton } from '@mui/material';

export default function TestListGridCardSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <Grid2 key={index} sx={{ width: 1, mx: 'auto', maxWidth: '470px' }} size={12}>
          <div className="flex flex-col gap-3 rounded-2xl border border-[#DDE1E6] p-5 shadow-sm">
            <Skeleton variant="text" width="70%" height={28} animation="wave" />
            <Skeleton variant="text" width="55%" height={26} animation="wave" />
            <Skeleton variant="text" width="50%" height={26} animation="wave" />
            <Skeleton variant="text" width="80%" height={26} animation="wave" />
            <Skeleton
              variant="rectangular"
              height={42}
              width="100%"
              animation="wave"
              sx={{ borderRadius: '8px' }}
            />
          </div>
        </Grid2>
      ))}
    </>
  );
}
