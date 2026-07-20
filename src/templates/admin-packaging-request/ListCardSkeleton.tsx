'use client';

import { Grid2, Skeleton } from '@mui/material';

export default function AdminPackagingRequestListCardSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <Grid2 key={index} sx={{ width: 1, mx: 'auto', maxWidth: '470px' }} size={12}>
          <div className="flex flex-col gap-3 rounded-2xl border border-[#DDE1E6] p-5 shadow-sm">
            <Skeleton variant="text" width="70%" height={28} animation="wave" />
            <Skeleton variant="text" width="45%" height={26} animation="wave" />
            <Skeleton
              variant="rounded"
              width="100%"
              height={44}
              animation="wave"
              sx={{ borderRadius: '10px' }}
            />
          </div>
        </Grid2>
      ))}
    </>
  );
}
