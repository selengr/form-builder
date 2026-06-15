'use client';

import Image from 'next/image';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Grid2 as Grid, IconButton, LinearProgress } from '@mui/material';
// image
import Filter from '@/../public/images/home-page/FilterAA.svg';
import TotalGrid from '@/../public/images/home-page/total-grid.svg';
// hooks
import { useDebounce } from '@/hooks/useDebounce';
// action
import { fetchListGridData } from '../../../actions/listGridActions';
// components
import CardSkeleton from './CardSkeleton';
import EmptyList from '@/components/ListGrid/EmptyList';
import BottomSheet from '@/components/BottomSheet/BottomSheet';
import ImmediateSearchInput from '@/components/ListGrid/ImmediateSearchInput';

export interface SearchBoxItem {
    fieldName: string;
    fieldOperation: 'MATCH' | 'EQUAL' | 'DSC' | 'ASC' | 'IN';
    fieldValue: string | string[];
    nextConditionOperator: 'OR' | 'AND';
}

interface IProps {
    url: string;
    title: string;
    searchQueryFilter?: any;
    textTotal?: [string, string];
    CartComponent?: React.ComponentType<any>;
    disableFilter?: boolean;
    filterBoxList: SearchBoxItem[];
    refreshGrid?: boolean;
    filterComponent: ReactNode;
}

const PAGE_SIZE = 10;

const DEFAULT_SEARCH_FILTER = {
    type: 'ALL',
    status: 'ALL',
    isCreatedSoloReport: 'ALL',
    fieldOperation: 'DSC',
};

const ListGrid: React.FC<IProps> = ({
    url,
    title,
    CartComponent,
    filterComponent,
    // searchBoxList,
    filterBoxList,
    refreshGrid,
    disableFilter,
    searchQueryFilter = DEFAULT_SEARCH_FILTER,
    textTotal = ['تعداد کل فرم‌ها', 'عدد'],
}) => {
    const router = useRouter();
    const { ref, inView } = useInView();

    const [query, setQuery] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [totalData, setTotalData] = useState<number>(0);
    const debouncedValue = useDebounce(query, 500);

    const searchBoxList = useMemo(() => [
        {
            fieldName: "formSetting.name",
            fieldOperation: "MATCH" as const,
            fieldValue: debouncedValue || "",
            nextConditionOperator: "OR" as const,
        },
    ], [debouncedValue]);

    const {
        data,
        error,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['public-form', searchBoxList, searchQueryFilter, filterBoxList, url],
        queryFn: async ({ pageParam = 0 }) => {
            const result = await fetchListGridData(
                { pageParam },
                searchBoxList,
                filterBoxList,
                url,
                searchQueryFilter
            )

            if (!result.success) {
                throw new Error(result.message)
            }
            return result
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) =>
            lastPage?.data?.length === PAGE_SIZE ? allPages.length : undefined,
        refetchOnWindowFocus: false,
        placeholderData: (previousData) => previousData,
    });

    useEffect(() => {
        if (error) toast.error((error as Error).message);
    }, [error]);

    useEffect(() => {
        if (data?.pages?.[0]?.total !== undefined) {
            setTotalData(data.pages[0].total);
        }
    }, [data]);

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const items = data?.pages.flatMap((p) => p.data) || [];

    const handleRefreshGrid = useCallback(() => {
        if (isFilterOpen) {
            setIsFilterOpen(false);
        }
        refetch();
    }, [isFilterOpen, refetch]);

    const openFilter = useCallback(() => {
        if (!disableFilter) {
            setIsFilterOpen(true);
        }
    }, [disableFilter]);


    useEffect(() => {
        if (refreshGrid) {
            handleRefreshGrid();
        }
    }, [refreshGrid]);

    const renderDesktopFilter = useCallback(
        () =>
            filterComponent && (
                <Grid
                    width='100%'
                    display={{ xs: 'none', lg: 'flex' }}
                    flexDirection='column'
                    justifyContent='flex-start'
                    alignItems='center'
                    sx={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        gap: 1,
                        ml: 0,
                        mr: 0,
                        p: 2,
                        maxWidth: '300px',
                    }}>
                    <Grid sx={{ width: '100%', minWidth: '200px', maxWidth: '300px' }}>{filterComponent}</Grid>
                </Grid>
            ),
        [filterComponent],
    );

    const renderSearchAndFilter = useCallback(
        () => (
            <Grid
                display='flex'
                sx={{
                    width: '100%',
                    maxWidth: '560px',
                    justifyContent: 'center',
                    mt: 1,
                    gap: 2,
                }}>
                <Grid size={{ xs: 12, sm: 10 }} sx={{ display: 'flex', alignItems: 'center', gap: '12px', mx: 'auto' }}>
                    <ImmediateSearchInput onSearch={setQuery} />
                    {!disableFilter && (
                        <IconButton
                            onClick={openFilter}
                            sx={{
                                display: { xs: 'flex', lg: 'none' },
                                flexShrink: 0,
                                border: '1px solid #c9c9c9',
                                borderRadius: '15px',
                                padding: '8px',
                                width: 51,
                                height: 51,
                            }}>
                            <Image src={Filter} width={35} height={35} alt='Filter' draggable={false} />
                        </IconButton>
                    )}
                </Grid>
            </Grid>
        ),
        [disableFilter, openFilter],
    );

    return (
        <div className="p-1 sm:py-2 h-full w-full flex flex-col overflow-hidden">

            <Grid
                width="100%"
                display="flex"
                sx={{
                    overflowY: 'hidden',
                    height: { xs: 'calc(100vh - 60px)', md: '100vh' },
                    flexDirection: { xs: 'column', lg: 'row' },
                }}
            >
                <Grid
                    container
                    flexDirection="column"
                    alignItems="center"
                    sx={{
                        bgcolor: 'white',
                        borderRadius: '16px',
                        p: { xs: 1, sm: 2 },
                        mx: { xs: 0, sm: 1 },
                        width: 1,
                        overflow: 'hidden',
                    }}
                >
                    <Grid container sx={{ width: '100%', justifyContent: 'center' }}>

                        {/* header */}
                        <div className="w-full h-[52px] flex items-center justify-center rounded-lg bg-[#F7F7FF] mb-4 relative">
                            <IconButton
                                sx={{ position: 'absolute', left: 8 }}
                                onClick={() => router.push('/')}
                            >
                                <MdOutlineKeyboardArrowRight />
                            </IconButton>

                            <p className="font-bold text-sm sm:text-base truncate px-8">{title}</p>
                        </div>

                        {/* total - fixed for mobile */}
                        <Grid sx={{ width: 1, mx: 'auto', maxWidth: '470px' }} size={{ xs: 12, md: 10, xl: 9 }}>
                            <div className='flex justify-between gap-2 bg-[#ECFAFF] rounded-2xl px-[10px] py-4 w-full'>
                                <div className='flex items-center gap-[6px] sm:gap-[10px] flex-shrink-0'>
                                    <Image src={TotalGrid} width={18} height={18} className='sm:w-5 sm:h-5 select-none' alt='total' draggable={false} />
                                    <p className='text-xs sm:text-sm text-[#393939] whitespace-nowrap'>{textTotal[0]}:</p>
                                </div>


                                {isFetching ? (
                                    <div className="w-11 h-5 bg-gray-200 rounded animate-pulse" />
                                ) : (
                                    <p className='flex items-center text-xs sm:text-sm text-[#393939] font-bold text-left break-words'>
                                        {totalData.toLocaleString('fa-IR')}   {textTotal[1]}
                                    </p>
                                )}
                            </div>
                        </Grid>

                        {/* search row */}
                        {/* <div className={`w-full mt-2 max-w-[470px]`}>
                            <ImmediateSearchInput onSearch={setQuery} />
                        </div> */}

                        {renderSearchAndFilter()}
                        {/* content */}
                        <Grid
                            id='content'
                            container
                            flexWrap='nowrap'
                            sx={{
                                width: 1,
                                mt: 1,
                                mb: 5,
                                pb: 4,
                                scrollbarWidth: "none",
                                // mr: { xs: 0, md: totalData! > 2 || isFetching ? -1.2 : 0 },
                                flexDirection: 'column',
                                gap: 2,
                                overflowY: 'auto',
                                px: { xs: 0, sm: 0 },
                                mx: { xs: 0, sm: 'auto' },
                                height: {
                                    xs: 'calc(100vh - 310px)',
                                    sm: 'calc(100vh - 290px)',
                                    md: 'calc(100vh - 230px)',
                                },
                            }}>
                            {isFetching && !isFetchingNextPage && (
                                <CardSkeleton />
                            )}


                            {items.length === 0 && !isFetching && (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        height: '100%',
                                        width: '100%',
                                    }}
                                >
                                    <EmptyList error={error?.message} />

                                </Box>
                            )}

                            {items.map((item: any, i: number) => {
                                const isLast = i === items.length - 1;

                                return (
                                    <Grid sx={{ width: 1, mx: 'auto', maxWidth: '470px' }} key={i} size={{ xs: 12, md: 10, xl: 9 }}>
                                        {CartComponent && <CartComponent data={item} />}

                                        {isLast && (
                                            <>
                                                <div ref={ref} />
                                                {isFetchingNextPage && <LinearProgress />}
                                            </>
                                        )}
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Grid>
                    <BottomSheet open={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
                        <Grid>{filterComponent}</Grid>
                    </BottomSheet>
                </Grid>
                {renderDesktopFilter()}
            </Grid>
        </div>
    );
};

export default ListGrid;