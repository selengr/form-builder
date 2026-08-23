'use client';

import { Grid2, Skeleton } from '@mui/material';

export default function SurveyListCardSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <Grid2 key={index} sx={{ width: 1, mx: 'auto', maxWidth: '470px' }} size={12}>
          <div className="relative flex flex-col gap-3 rounded-2xl border border-[#DDE1E6] p-4 w-full max-w-full">
            <Skeleton
              variant="rounded"
              width={44}
              height={24}
              animation="wave"
              sx={{ position: 'absolute', top: 15, right: 15, borderRadius: '12px' }}
            />

            <div className="flex items-start gap-1">
              <Skeleton variant="text" width={40} height={20} animation="wave" />
              <Skeleton variant="text" width="55%" height={20} animation="wave" />
            </div>

            <div className="flex items-start gap-1">
              <Skeleton variant="text" width={88} height={20} animation="wave" />
              <Skeleton variant="text" width="35%" height={20} animation="wave" />
            </div>

            <div className="flex items-start gap-1">
              <Skeleton variant="text" width={52} height={20} animation="wave" />
              <Skeleton variant="text" width="22%" height={20} animation="wave" />
            </div>

            <div className="flex flex-wrap gap-2 w-full justify-between">
              <Skeleton
                variant="rounded"
                width={140}
                height={42}
                animation="wave"
                sx={{ borderRadius: '8px' }}
              />

              <div className="flex gap-2 items-center justify-end">
                <Skeleton variant="circular" width={40} height={40} animation="wave" />
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
