'use client';

import { Grid2, Skeleton } from '@mui/material';

export default function ListCardSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <Grid2
          key={i}
          sx={{ width: 1, mx: 'auto', maxWidth: '470px' }}
          size={{ xs: 12, md: 10, xl: 9 }}
        >

          <div
            className="
              border border-[#DDE1E6]
              p-4 rounded-[20px]
              flex flex-col gap-4
              w-full max-w-full pb-5
              "
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <Skeleton variant="text" width={180} height={28} />
              <Skeleton variant="rectangular" width={46} height={24} sx={{ borderRadius: 12 }} />
            </div>

            {/* Info rows */}
            <div className="grid grid-cols-1 gap-2">
              <Skeleton variant="text" height={24} width="60%" />
              <Skeleton variant="text" height={24} width="55%" />
              <Skeleton variant="text" height={24} width="50%" />
              <Skeleton variant="text" height={24} width="45%" />
              <Skeleton variant="text" height={24} width="50%" />
              {/* <Skeleton variant="text" height={24} width="40%" /> */}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 w-full justify-between items-center">
              <Skeleton
                variant="rectangular"
                width={120}
                height={42}
                sx={{ borderRadius: '8px' }}
              />

              <div className="flex gap-2">
                <Skeleton variant="circular" width={32} height={32} />
                <Skeleton variant="circular" width={32} height={32} />
                <Skeleton variant="circular" width={32} height={32} />
                <Skeleton variant="circular" width={32} height={32} />
              </div>
            </div>
          </div>
        </Grid2>
      ))}
    </>
  );
}
