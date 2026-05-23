import { Skeleton, Box, Grid2 } from '@mui/material';

const AssessmentsCardSkeleton: React.FC = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
       <Grid2 sx={{ width: 1, mx: 'auto', maxWidth: '470px' }} size={{ xs: 12, md: 10, xl: 9 }}>
          <div className="border border-[#DDE1E6] p-3 rounded-2xl flex flex-col gap-0 w-full max-w-full">

            {/* Info Rows Skeleton */}
            <div className="space-y-2 mt-2">
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Skeleton variant="text" width="30%" />
                <Skeleton variant="text" width="50%" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Skeleton variant="text" width="25%" />
                <Skeleton variant="text" width="40%" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Skeleton variant="text" width="35%" />
                <Skeleton variant="text" width="45%" />
              </Box>
            </div>

            {/* Buttons Skeleton */}
            <div className="flex w-full gap-4 flex-col sm:flex-row mt-2">
              <Skeleton variant="rounded" height={42} sx={{ flex: 1 }} />
              <Skeleton variant="rounded" height={42} sx={{ flex: 1 }} />
            </div>
          </div>
        </Grid2>
        ))}
    </>
  );
};

export default AssessmentsCardSkeleton;
