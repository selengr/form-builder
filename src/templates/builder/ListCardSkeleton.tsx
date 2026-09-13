'use client';

import { Grid2, Skeleton } from '@mui/material';

export default function ListCardSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <Grid2 key={i} sx={{ width: '100%', mx: 'auto' }} size={12}>
          <div className="border border-[#DDE1E6] p-4 rounded-[20px] flex flex-col gap-4 w-full max-w-full pb-5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <Skeleton variant="text" width={180} height={28} animation="wave" />
              <Skeleton
                variant="rectangular"
                width={46}
                height={24}
                animation="wave"
                sx={{ borderRadius: 12 }}
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Skeleton variant="text" height={24} width="60%" animation="wave" />
              <Skeleton variant="text" height={24} width="55%" animation="wave" />
              <Skeleton variant="text" height={24} width="50%" animation="wave" />
              <Skeleton variant="text" height={24} width="45%" animation="wave" />
              <Skeleton variant="text" height={24} width="50%" animation="wave" />
            </div>

            <div className="flex flex-wrap gap-2 w-full justify-between items-center">
              <Skeleton
                variant="rectangular"
                width={120}
                height={42}
                animation="wave"
                sx={{ borderRadius: '8px' }}
              />

              <div className="flex gap-2">
                <Skeleton variant="circular" width={32} height={32} animation="wave" />
                <Skeleton variant="circular" width={32} height={32} animation="wave" />
                <Skeleton variant="circular" width={32} height={32} animation="wave" />
                <Skeleton variant="circular" width={32} height={32} animation="wave" />
              </div>
            </div>
          </div>
        </Grid2>
      ))}
    </>
  );
}
