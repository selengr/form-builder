'use client';

import { Grid2, Skeleton } from '@mui/material';

export default function PackagingListCardSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <Grid2 key={index} sx={{ width: 1, mx: 'auto', maxWidth: '470px' }} size={12}>
          <div className="relative flex flex-col gap-3 rounded-2xl border border-[#DDE1E6] p-4 w-full max-w-full shadow-sm">
            <Skeleton
              variant="rounded"
              width={44}
              height={24}
              animation="wave"
              sx={{ position: 'absolute', top: 15, right: 15, borderRadius: '12px' }}
            />

            <div className="flex items-start gap-1">
              <Skeleton variant="text" width={56} height={20} animation="wave" />
              <Skeleton variant="text" width="48%" height={20} animation="wave" />
            </div>

            <div className="flex items-center gap-1">
              <Skeleton
                variant="rounded"
                width={92}
                height={26}
                animation="wave"
                sx={{ borderRadius: '8px' }}
              />
            </div>

            <div className="flex flex-wrap gap-1 w-full justify-between">
              <div className="flex items-center gap-1 flex-wrap">
                <Skeleton
                  variant="rounded"
                  width={100}
                  height={36}
                  animation="wave"
                  sx={{ borderRadius: '8px', maxWidth: 100, minWidth: 100 }}
                />
                <Skeleton
                  variant="rounded"
                  width={114}
                  height={36}
                  animation="wave"
                  sx={{ borderRadius: '8px', minWidth: 114, maxWidth: 110 }}
                />
              </div>

              <div className="flex gap-2 items-center justify-end">
                <Skeleton variant="circular" width={24} height={24} animation="wave" />
                <Skeleton variant="circular" width={24} height={24} animation="wave" />
              </div>
            </div>
          </div>
        </Grid2>
      ))}
    </>
  );
}
