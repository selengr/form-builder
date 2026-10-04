'use client';

import { Grid2, Skeleton } from '@mui/material';

export default function FormulaListCardSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <Grid2 key={index} sx={{ width: 1, mx: 'auto', maxWidth: '470px' }} size={12}>
          <div className="relative flex flex-col gap-3 rounded-2xl border border-[#DDE1E6] p-4 w-full max-w-full">
            <Skeleton
              variant="rounded"
              width={43}
              height={23}
              animation="wave"
              sx={{ position: 'absolute', top: 15, right: 15, borderRadius: '20px' }}
            />

            <div className="flex items-start gap-1">
              <Skeleton variant="text" width={64} height={20} animation="wave" />
              <Skeleton variant="text" width="45%" height={20} animation="wave" />
            </div>

            <div className="flex items-start gap-1">
              <Skeleton variant="text" width={88} height={20} animation="wave" />
              <Skeleton variant="text" width="35%" height={20} animation="wave" />
            </div>

            <div className="flex flex-wrap gap-2 w-full justify-between">
              <div className="flex gap-2">
                <Skeleton
                  variant="rounded"
                  width={100}
                  height={42}
                  animation="wave"
                  sx={{ borderRadius: '8px' }}
                />
                <Skeleton
                  variant="rounded"
                  width={100}
                  height={42}
                  animation="wave"
                  sx={{ borderRadius: '8px' }}
                />
              </div>

              <div className="flex gap-2 items-center justify-end">
                <Skeleton variant="circular" width={40} height={40} animation="wave" />
                <Skeleton variant="circular" width={40} height={40} animation="wave" />
              </div>
            </div>
          </div>
        </Grid2>
      ))}
    </>
  );
}
