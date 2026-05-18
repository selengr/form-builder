'use client';

import Image from 'next/image';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import React, { useEffect, useMemo, useState } from 'react';
import { Box, Grid2 as Grid, IconButton, LinearProgress, Typography } from '@mui/material';
// image
import TotalGrid from '@/../public/images/home-page/total-grid.svg';
import formListEmpty from '@/../public/images/home-page/formListEmpty.png';
// hooks
import { useDebounce } from '@/hooks/useDebounce';
// action
import { fetchListGridData } from '../../../actions/listGridActions';
// components
import CardSkeleton from './CardSkeleton ';
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
    searchQueryFilter = DEFAULT_SEARCH_FILTER,
    textTotal = ['تعداد کل فرم‌ها', 'عدد'],
}) => {
    const router = useRouter();
    const { ref, inView } = useInView();

    const [query, setQuery] = useState('');
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
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['public-form', searchBoxList, url],
        queryFn: ({ pageParam = 0 }) =>
            fetchListGridData(
                { pageParam },
                searchBoxList,
                [],
                url,
                searchQueryFilter
            ),
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
                        <div className='flex justify-between gap-2 bg-[#ECFAFF] rounded-2xl px-3 sm:px-[10px] py-3 sm:py-4 w-[calc(100%-16px)] sm:w-full max-w-[400px] mx-auto hover:brightness-98 transition-all duration-200'>
                            <div className='flex items-center gap-[6px] sm:gap-[10px] flex-shrink-0'>
                                <Image src={TotalGrid} width={18} height={18} className='sm:w-5 sm:h-5 select-none' alt='total' draggable={false} />
                                <p className='text-xs sm:text-sm text-[#393939] whitespace-nowrap'>{textTotal[0]}:</p>
                            </div>
                            <p className='flex items-center text-xs sm:text-sm text-[#393939] font-bold text-left break-words'>
                                {totalData.toLocaleString('fa-IR')} {textTotal[1]}
                            </p>
                        </div>

                        {/* search row */}
                        <div className={`w-full mt-2 max-w-[470px] ${items.length > 4 ? "sm:ml-4" : "sm:ml-0"}`}>
                            <ImmediateSearchInput onSearch={setQuery} />
                        </div>

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

                                <>
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Grid key={i} sx={{ width: 1, maxWidth: 470, mx: 'auto' }}>
                                            <CardSkeleton />
                                        </Grid>
                                    ))}
                                </>
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
                                    <div className='h-44 sm:h-56 bg ml-14 sm:ml-3'>

                                        <Image src={formListEmpty} height={200} className="sm:h-[250px] w-auto" alt="empty" priority />
                                    </div>

                                    <span className='text-[#999] text-sm md:text-md'>موردی یافت نشد</span>

                                </Box>
                            )}

                            {items.map((item: any, i: number) => {
                                const isLast = i === items.length - 1;

                                return (
                                    <Grid key={i} sx={{ width: 1, maxWidth: 470, mx: 'auto', px: { xs: 0.5, sm: 0 } }}>
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

                </Grid>
            </Grid>
        </div>
    );
};

export default ListGrid;