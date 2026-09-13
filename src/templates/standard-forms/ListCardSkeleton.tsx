'use client';

import { Grid2, Skeleton } from '@mui/material';

export default function ListCardSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <Grid2 key={index} sx={{ width: 1, mx: 'auto', maxWidth: '470px' }} size={12}>
          <div className="border border-[#DDE1E6] p-2 rounded-2xl flex flex-col gap-4 w-full relative bg-white">
            <div className="flex flex-wrap gap-2 w-full items-center justify-between">
              <div className="flex-1 min-w-0">
                <Skeleton variant="text" width={70} height={22} animation="wave" />
                <Skeleton variant="text" width="60%" height={28} animation="wave" />
              </div>

              <Skeleton
                variant="rounded"
                width={96}
                height={36}
                animation="wave"
                sx={{ borderRadius: '8px' }}
              />
            </div>
          </div>
        </Grid2>
      ))}
    </>
  );
}
