'use client';

import Image from 'next/image';
import { toast } from 'sonner';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useRouter, useSearchParams } from 'next/navigation';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { Box, Grid2 as Grid, IconButton, LinearProgress, Typography } from '@mui/material';

import SearchInput from '@/components/ListGrid/SearchInput';
import CreateFormBtn from '@/components/CreateFormBtn/CreateFormBtn';

import Filter from '@/../public/images/home-page/FilterAA.svg';
import PlusIcon from '@/../public/images/home-page/Add-fill.svg';
import TotalGrid from '@/../public/images/home-page/total-grid.svg';
import formListEmpty from '@/../public/images/home-page/formListEmpty.png';

import { fetchListGridData } from '../../../actions/listGridActions';

export interface SearchBoxItem {
    fieldName: string;
    fieldOperation: 'MATCH' | 'EQUAL' | 'DSC' | 'ASC' | 'IN';
    fieldValue: string | string[];
    nextConditionOperator: 'OR' | 'AND';
}

interface Props {
    searchBoxList: SearchBoxItem[];
    filterBoxList: SearchBoxItem[];
    filterComponent: ReactNode;
    url: string;
    CartComponent?: React.ComponentType<any>;
    disableFilter?: boolean;
    textTotal?: [string, string];
    searchQueryFilter?: any;
    showCreateButton?: boolean;
    title: string;
    CreateButton?: any;
}

const PAGE_SIZE = 10;

const DEFAULT_SEARCH_FILTER = {
    type: 'ALL',
    status: 'ALL',
    isCreatedSoloReport: 'ALL',
    fieldOperation: 'DSC',
};

const ListGrid: React.FC<Props> = ({
    filterComponent,
    searchBoxList,
    filterBoxList,
    CartComponent,
    url,
    disableFilter,
    searchQueryFilter = DEFAULT_SEARCH_FILTER,
    showCreateButton = false,
    title,
    textTotal = ['تعداد کل فرم‌ها', 'عدد'],
    CreateButton,
}) => {
    const router = useRouter();
    const { ref, inView } = useInView();

    const searchParams = useSearchParams();
    const query = searchParams.get('query') || '';

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [totalData, setTotalData] = useState<number>(0);

    useEffect(() => {
        setIsDialogOpen(searchParams.get('new') !== null);
    }, [searchParams]);

    const updatedSearchBoxList = useMemo(() => {
        return searchBoxList.map((item) =>
            item.fieldName === 'formSetting.name' && query
                ? { ...item, fieldValue: query }
                : item
        );
    }, [searchBoxList, query]);

    const queryKey = useMemo(
        () => ['list-grid', query, searchQueryFilter, filterBoxList],
        [query, searchQueryFilter, filterBoxList]
    );

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey,
        queryFn: ({ pageParam = 0 }) =>
            fetchListGridData(
                { pageParam },
                updatedSearchBoxList,
                filterBoxList,
                url,
                searchQueryFilter
            ),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) =>
            lastPage?.data?.length === PAGE_SIZE ? allPages.length : undefined,
        refetchOnWindowFocus: false,
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

    const handleOpenDialog = () => router.push('?new');

    const handleCloseDialog = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('new');
        router.replace(`?${params.toString()}`);
    };

    return (
        <div className="p-2 sm:p-3 md:p-4 h-screen w-full flex flex-col overflow-hidden">
            {isFetching && !isFetchingNextPage && <LinearProgress />}

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

                        {/* search & filter row */}
                        <div className='w-full max-w-[560px] mx-auto px-2 sm:px-0'>
                            <div className='flex items-center justify-center gap-2 mt-3'>
                                <div className='flex-1 min-w-0'>
                                    <SearchInput />
                                </div>

                                {!disableFilter && (
                                    <IconButton
                                        onClick={() => setIsFilterOpen(true)}
                                        sx={{
                                            border: '1px solid #c9c9c9',
                                            borderRadius: '15px',
                                            width: { xs: 44, sm: 50 },
                                            height: { xs: 44, sm: 50 },
                                            flexShrink: 0,
                                        }}
                                    >
                                        <Image src={Filter} width={24} height={24} className='sm:w-[30px] sm:h-[30px]' alt="filter" />
                                    </IconButton>
                                )}
                            </div>
                        </div>

                        {/* create button */}
                        {showCreateButton && (
                            <div className="flex justify-center mt-3">
                                <IconButton
                                    onClick={handleOpenDialog}
                                    sx={{
                                        width: { xs: 44, sm: 50 },
                                        height: { xs: 44, sm: 50 },
                                        border: '1px solid #1758BA',
                                    }}
                                >
                                    <Image src={PlusIcon} width={20} height={20} alt="create" />
                                </IconButton>
                            </div>
                        )}

                        <CreateFormBtn open={isDialogOpen} onClose={handleCloseDialog} />

                        {/* content */}
                        <Grid
                            id='content'
                            container
                            flexWrap='nowrap'
                            sx={{
                                width: 1,
                                mx: 'auto',
                                mt: 2,
                                mb: 5,
                                pb: 4,
                                flexDirection: 'column',
                                gap: 2,
                                overflowY: 'auto',
                                px: { xs: 1, sm: 0 },
                                height: {
                                    xs: 'calc(100vh - 310px)',
                                    sm: 'calc(100vh - 290px)',
                                    md: 'calc(100vh - 230px)',
                                },
                            }}>
                            {items.length === 0 && !isFetching && (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        mt: 10,
                                        px: 2,
                                    }}
                                >
                                    <Image src={formListEmpty} height={200} className="sm:h-[250px] w-auto" alt="empty" />
                                    <Typography sx={{ mt: 2 }}>موردی یافت نشد</Typography>
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