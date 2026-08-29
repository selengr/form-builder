'use client';

import { Grid2, Skeleton } from '@mui/material';

export default function UserReportsListCardSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <Grid2 key={index} sx={{ width: 1, mx: 'auto', maxWidth: '450px' }} size={12}>
          <div className="relative flex flex-col rounded-lg bg-[#F7F7FF] p-4 pb-8 w-full">
            <div className="rounded-lg border border-[#1758BA] bg-white p-2 w-full">
              <div className="flex flex-col gap-3 p-1">
                <div className="flex items-center gap-2">
                  <Skeleton variant="text" width={88} height={20} animation="wave" />
                  <Skeleton variant="text" width="40%" height={20} animation="wave" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton variant="text" width={72} height={20} animation="wave" />
                  <Skeleton variant="text" width="45%" height={20} animation="wave" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton variant="text" width={64} height={20} animation="wave" />
                  <Skeleton variant="text" width="35%" height={20} animation="wave" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton variant="text" width={72} height={20} animation="wave" />
                  <Skeleton variant="text" width="55%" height={20} animation="wave" />
                </div>
              </div>
            </div>
            <Skeleton
              variant="text"
              width={72}
              height={18}
              animation="wave"
              sx={{ position: 'absolute', left: 16, bottom: 4 }}
            />
          </div>
        </Grid2>
      ))}
    </>
  );
}
