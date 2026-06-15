'use client';

import { Grid2, Skeleton } from '@mui/material';

const FormCardSkeleton = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <Grid2 sx={{ width: 1, mx: 'auto', maxWidth: '470px' }} key={i} size={{ xs: 12, md: 10, xl: 9 }}>

          <div className="border p-4 rounded-2xl border-[#DDE1E6] flex flex-col gap-2 w-full max-w-full relative">

            <div className="space-y-2 mt-1">
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="text" width="40%" height={24} />
              {/* <Skeleton variant="text" width="50%" height={24} /> */}
            </div>


            <div className="flex w-full gap-1 flex-col sm:flex-row mt-1">
              <Skeleton
                variant="rounded"
                height={37}
                className="w-full sm:flex-1 rounded-xl"
              />

            </div>
          </div>
        </Grid2 >
      ))}
    </>
  );
};

export default FormCardSkeleton;
