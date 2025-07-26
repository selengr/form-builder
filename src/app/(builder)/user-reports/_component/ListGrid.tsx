"use client";
// React & Libs
import Image from "next/image";
import { toast } from "sonner";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import React, { ReactNode, useCallback, useEffect } from "react";
import { Box, Grid2 as Grid, IconButton, LinearProgress, Typography } from "@mui/material";
//types
import { TReporterInformationItem } from "./type";
// apis
import { fetchData } from "./dataService";
import { RenderAction } from "./ActionButton";
// image
import formListEmpty from '@/../public/images/home-page/formListEmpty.png'

interface SearchBoxItem {
  fieldName: "typeOfReport" | "responseForDestroyerReport";
  fieldOperation: "MATCH" | "EQUAL" | "DSC" | "ASC" | "IN";
  fieldValue: string | string[];
  nextConditionOperator: "OR" | "AND";
}

interface Props {
  searchBoxList: SearchBoxItem[];
  filterBoxList: SearchBoxItem[];
  filterComponent: ReactNode;
  url: string;
  onCheck?: (id: any, checked: any) => void;
  onDelete?: () => void;
  CartComponent?: React.ComponentType<{
    data: any; onCheck?: (id: any, checked: any) => void; refreshGrid?: () => void;
  }>;
  refreshData?: () => void;
  refreshGrid?: boolean;
  disableFilter?: boolean;
  searchQueryFilter?: { responseForDestroyerReport: string; typeOfReport: string };
}

const DEFAULT_SEARCH_FILTER = { responseForDestroyerReport: "ALL", typeOfReport: "ALL" };

const ListGrid: React.FC<Props> = ({
  filterComponent,
  searchBoxList,
  filterBoxList,
  CartComponent,
  url,
  onCheck,
  refreshGrid,
  disableFilter,
  searchQueryFilter = DEFAULT_SEARCH_FILTER
}) => {
  const { ref, inView } = useInView();
  const searchParams = useSearchParams();
  const query = searchParams.get("query")?.toString() || "";


  const router = useRouter();

  const {
    data: pages, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, refetch,
  } = useInfiniteQuery({
    queryKey: ["datas", query, searchQueryFilter, filterBoxList],
    queryFn: ({ pageParam }) => fetchData({ pageParam }, searchBoxList, filterBoxList, url, searchQueryFilter),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // Assuming PAGE_SIZE is defined in dataService or passed as a prop/constant
      const PAGE_SIZE = 10;
      return lastPage.data && lastPage.data.length === PAGE_SIZE ? allPages.length : undefined;
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  if (error) {
    toast.error(error.message);
  }
console.log('pages', pages)
  const renderHeader = useCallback(() => (<div
    className="w-full h-[52px] flex items-center justify-center gap-4 rounded-lg bg-[#F7F7FF] px-2 mb-4 relative shrink-0">
    <IconButton sx={{ position: "absolute", left: "8px" }} onClick={() => router.push("/user-reports")}>
      <MdOutlineKeyboardArrowRight color="#292D32" />
    </IconButton>
    <p className="text-[16px] text-center font-bold text-[#161616]">
      {pages?.pages[0].data.formName}
    </p>
  </div>), [pages?.pages[0].data.formName, router]);


  const renderContent = useCallback(() => {
    const allItems = pages?.pages.flatMap(page => page.data) || [];
    if (isFetching && !isFetchingNextPage) {
      return (<Box sx={{ width: "100%", mt: 2 }}>
        <LinearProgress />
      </Box>);
    }

    if (allItems.length === 0) {
      return (<Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          height: "60vh",
          width: "100%",
        }}
      >
        <Image src={formListEmpty} alt="No forms found" height={256} priority draggable={false} />
        <Typography sx={{ fontSize: "18px", color: "#999" }}>
          موردی یافت نشد
        </Typography>
      </Box>);
    }

    // @ts-ignore
    return pages.pages.map((page, pageIndex) => (page.data.reporterInformation?.map((data: TReporterInformationItem, index: number) => {
      const key = `${pageIndex}-${index}`;
      // @ts-ignore
      const isLastItem = (pageIndex === pages.pages.length - 1) && (index === page.data.length - 1);

      return (<Grid sx={{ width: 1, mx: "auto" }} key={key} size={{ xs: 12, md: 10, xl: 9 }}>
        {CartComponent && (<CartComponent onCheck={onCheck} data={data} />)}
        {isLastItem && (<>
          <Typography component="h1" ref={ref} sx={{ height: 0 }} />
          <Box sx={{ width: "100%" }}>
            {isFetchingNextPage && <LinearProgress />}
          </Box>
        </>)}
      </Grid>);
    })));
  }, [pages, isFetching, isFetchingNextPage, CartComponent, onCheck, ref]);

  const renderDesktopFilter = useCallback(() => (filterComponent && (<Grid
    width="100%"
    display={{ xs: "none", lg: "flex" }}
    flexDirection="column"
    justifyContent="flex-start"
    alignItems="center"
    sx={{
      backgroundColor: "white", borderRadius: "16px", gap: 1, m: 1, ml: 0, p: 2, maxWidth: "300px",
    }}
  >
    <Grid sx={{ width: "100%", minWidth: "200px", maxWidth: "300px" }}>
      {filterComponent}
    </Grid>
  </Grid>)), [filterComponent]);


  return (<div className={"p-2 h-screen w-full flex flex-col"}>
    {isFetching && !isFetchingNextPage ?

      (<Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>) : (<Grid
        width="100%"
        display="flex"
        sx={{
          overflowY: "hidden",
          userSelect: "none",
          height: { xs: "calc(100vh - 60px)", md: "100vh" },
          flexDirection: { xs: "column", lg: "row" },
        }}
      >
        <Grid
          display="flex"
          flexDirection="column"
          position={"relative"}
          justifyContent="flex-start"
          alignItems="center"
          container
          sx={{
            bgcolor: "white", borderRadius: "16px", p: 2, mx: 1, width: 1, overflowY: "hidden", height: "100%",
          }}
        >
          <Grid container sx={{ width: "100%", justifyContent: "center", mx: "auto" }} >
            {renderHeader()}

            <Grid
              id="content"
              container
              flexWrap="nowrap"
              sx={{
                width: 1,
                mx: "auto", mt: 1, mb: 5, pb: 4, flexDirection: "column", gap: 2, overflowY: "auto", height: {
                  xs: "calc(100vh - 290px)", md: "calc(100vh - 210px)",
                },
              }}
            >
              {renderContent()}
            </Grid>
          </Grid>
          <RenderAction id={pages?.pages[0].data.formId} publicationApprovalByAdmin={pages?.pages[0].publicationApprovalByAdmin}/>
        </Grid>
        {renderDesktopFilter()}
      </Grid>)}
  </div>);
};

export default ListGrid;
