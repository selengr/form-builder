'use client';

import { Grid, Skeleton } from '@mui/material';

const FormCardSkeleton = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <Grid key={i} sx={{ width: 1, maxWidth: 470, mx: 'auto' }}>
          <div className="border p-4 rounded-2xl border-[#DDE1E6] flex flex-col gap-3 w-full max-w-full relative">

            <div className="space-y-3 mt-2">
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="text" width="40%" height={24} />
              <Skeleton variant="text" width="50%" height={24} />
            </div>


            <div className="flex w-full gap-2 flex-col sm:flex-row mt-2">
              <Skeleton
                variant="rounded"
                height={25}
                className="w-full sm:flex-1 rounded-full"
              />

            </div>
          </div>
        </Grid >
      ))}
    </>
  );
};

export default FormCardSkeleton;
