'use client';

import React from 'react';
import { Grid2, Skeleton } from '@mui/material';

const ListCardSkeleton: React.FC = () => {
    return (
        <>
            {
                Array.from({ length: 4 }).map((_, index) => (
                    <Grid2
                        sx={{
                            width: 1, mx: 'auto', maxWidth: '470px',

                        }}
                        key={index}
                        size={{ xs: 12, md: 10, xl: 9 }}
                    >
                        <div
                            className="
                                    border border-[#DDE1E6] 
                                    p-2 rounded-2xl 
                                    flex flex-col gap-4 
                                    w-full relative 
                                    bg-white -mr-3
                                "
                        >
                            <div className="flex flex-wrap gap-2 w-full items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <Skeleton variant="text" width={70} height={22} />
                                    <Skeleton variant="text" width="60%" height={28} />
                                </div>

                                <Skeleton
                                    variant="rounded"
                                    width={96}
                                    height={36}
                                    sx={{ borderRadius: '8px' }}
                                />
                            </div>
                        </div>
                    </Grid2>
                ))}

        </>

    );
};

export default ListCardSkeleton;
