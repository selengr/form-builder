'use client';

import { Skeleton, Box, Grid2 } from '@mui/material';

export default function CardSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <Grid2 key={i} sx={{ width: '100%', mx: 'auto' }} size={12}>
          <div className="border border-[#DDE1E6] p-3 rounded-2xl flex flex-col gap-0 w-full max-w-full">
            <div className="space-y-2 mt-2">
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Skeleton variant="text" width="30%" animation="wave" />
                <Skeleton variant="text" width="50%" animation="wave" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Skeleton variant="text" width="25%" animation="wave" />
                <Skeleton variant="text" width="40%" animation="wave" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Skeleton variant="text" width="35%" animation="wave" />
                <Skeleton variant="text" width="45%" animation="wave" />
              </Box>
            </div>

            <div className="flex w-full gap-4 flex-col sm:flex-row mt-2">
              <Skeleton variant="rounded" height={42} sx={{ flex: 1 }} animation="wave" />
              <Skeleton variant="rounded" height={42} sx={{ flex: 1 }} animation="wave" />
            </div>
          </div>
        </Grid2>
      ))}
    </>
  );
}
