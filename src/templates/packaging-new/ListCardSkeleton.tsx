'use client';

import { Grid2, Skeleton } from '@mui/material';

export default function PackagingListCardSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <Grid2 key={index} sx={{ width: 1, mx: 'auto', maxWidth: '470px' }} size={12}>
          <div className="relative flex flex-col gap-3 rounded-2xl border border-[#DDE1E6] p-4">
            <Skeleton
              variant="rounded"
              width={44}
              height={24}
              animation="wave"
              sx={{ position: 'absolute', top: 15, right: 15, borderRadius: '12px' }}
            />

            <Skeleton variant="text" width="55%" height={28} animation="wave" />
            <Skeleton variant="text" width="40%" height={26} animation="wave" />

            <div className="flex flex-wrap gap-2 w-full justify-between mt-1">
              <div className="flex items-center gap-1 flex-wrap">
                <Skeleton variant="rounded" width={100} height={36} animation="wave" sx={{ borderRadius: '8px' }} />
                <Skeleton variant="rounded" width={114} height={36} animation="wave" sx={{ borderRadius: '8px' }} />
              </div>
              <div className="flex gap-2 items-center">
                <Skeleton variant="circular" width={32} height={32} animation="wave" />
                <Skeleton variant="circular" width={24} height={24} animation="wave" />
              </div>
            </div>
          </div>
        </Grid2>
      ))}
    </>
  );
}
