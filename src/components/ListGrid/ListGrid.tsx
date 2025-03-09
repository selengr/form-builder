"use client";

import React, { ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useRouter, useSearchParams } from "next/navigation";
import SearchInput from "./SearchInput";
import {
  Box,
  Grid2,
  IconButton,
  LinearProgress,
  Typography,
} from "@mui/material";
import TotalGrid from "@/../public/images/home-page/total-grid.svg";
import { clientFetch } from "./clientFetch";
import BottomSheet from "../BottomSheet/BottomSheet";
import CreateFormBtn from "../CreateFormBtn/CreateFormBtn";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

interface SearchBoxItem {
  fieldName: string;
  fieldOperation: "MATCH" | "EQUAL" | "DSC" | "ASC";
  fieldValue: string;
  nextConditionOperator: "OR" | "AND";
}

interface Props {
  searchBoxList: SearchBoxItem[];
  filterBoxList: SearchBoxItem[];
  filterComponent: ReactNode;
  url: string;
  onCheck?: any;
  onDelete?: any;
  CartComponent?: any;
  refreshData?: () => void;
  refreshGrid?: boolean;
  disableFilter: boolean | undefined;
  textTotal?: any;
  searchQueryFilter: any;
  showCreateButton?: boolean;
  title: string;
}

let totalData: any = null;
async function getdatas(
  { pageParam = 0 }: { pageParam: number },
  searchFilterBoxList: any,
  url: string,
  searchQueryFilter: any = { type: "ALL", status: "PUBLIC" }
) {
  const params = {
    searchFilterBoxList,
    sortList: [
      {
        fieldName: "id",
        type: "DSC",
      },
    ],
    page: pageParam,
    rows: 10,
  };

  const res = await clientFetch(
    `${url}${searchQueryFilter.type}/${searchQueryFilter.status}?searchFilterModel=`,
    params
  );

  if (!res) {
    throw new Error("خطا در ارتباط با سرور");
  }

  totalData = res.data.totalElements;

  return res.data.content;
}

const ListGrid: React.FC<Props> = ({
  filterComponent,
  searchBoxList,
  filterBoxList,
  CartComponent,
  url,
  onCheck,
  refreshGrid,
  disableFilter,
  searchQueryFilter,
  showCreateButton = false,
  title,
  textTotal = ["", "عدد"],
}) => {
  const { ref, inView } = useInView();
  const searchParams = useSearchParams();
  const query = searchParams.get("query")?.toString() || "";
  const [queryState, setQueryState] = useState(query);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleOpen = () => {
    if (!disableFilter) {
      setOpen(true);
    }
  };

  const handleClose = () => setOpen(false);

  const deleteItem = (filterBoxList: any) => {
    const arrayTemp: any = [];
    filterBoxList.forEach((item: any) => {
      if (item.fieldValue != null) arrayTemp.push(item);
    });
    return arrayTemp;
  };

  const deleteEmpty = (searchBoxList: any) => {
    const arrayTemp: any = [];
    if (query != "") return searchBoxList;
    return arrayTemp;
  };

  const searchFilterBoxList = [
    {
      restrictionList: deleteItem(filterBoxList),
    },
    {
      restrictionList: deleteEmpty(searchBoxList),
    },
  ];

  const {
    data: datas,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["datas", queryState],
    queryFn: ({ pageParam }) =>
      getdatas({ pageParam }, searchFilterBoxList, url, searchQueryFilter),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 10 ? allPages.length : undefined;
    },
    refetchOnWindowFocus: false,
  });

  const handleRefreshGrid = () => {
    if (open) {
      setOpen(false);
    }
    refetch();
  };

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  useEffect(() => {
    searchBoxList.forEach((item) => (item.fieldValue = query));
    setQueryState(query);
  }, [query]);

  useEffect(() => {
    handleRefreshGrid();
  }, [refreshGrid]);

  if (isFetching && !isFetchingNextPage) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Grid2
      width="100%"
      display="flex"
      sx={{
        userSelect: "none",
      }}
    >
      <Grid2
        width="100%"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="center"
        container
        sx={{
          bgcolor: "white",
          height: "100vh",
          flexDirection: "column",
          alignItems: "flex-end",
          p: 2,
          m: 1,
          borderRadius: "16px",
          maxWidth: "100%",
          overflowY: "auto",
        }}
      >
        <Grid2
          container
          sx={{ width: "100%", justifyContent: "center", mx: "auto" }}
        >
          <div className="w-full h-[52px] flex items-center justify-center gap-4 rounded-lg bg-[#F7F7FF] px-2 mb-4 relative">
            <IconButton
              sx={{ position: "absolute", left: "8px" }}
              onClick={() => {
                router.push("/");
              }}
            >
              <MdOutlineKeyboardArrowRight color="#292D32" />
            </IconButton>
            <p className="text-[16px] text-center font-bold text-[#161616]">
              {title}
            </p>
          </div>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "12px",
              width: "100%",
            }}
          >
            <Grid2
              display="flex"
              sx={{
                width: "100%",
                maxWidth: "400px",
                justifyContent: "space-between",
                gap: 2,
                bgcolor: "#ECFAFF",
                borderRadius: "16px",
                paddingX: "10px",
                paddingY: "16px",
              }}
            >
              <Box display="flex" justifyItems="center" gap="10px">
                <Image src={TotalGrid} width={20} height={20} alt="filter" />
                <Typography color="#393939" fontSize="14px">
                  تعداد کل فرم‌ها {textTotal[0]}:
                </Typography>
              </Box>
              <p className="flex items-center text-[14px] text-[#393939] font-bold">
                {totalData} {textTotal[1]}
              </p>
            </Grid2>
            {showCreateButton && (
              <div className="min-w-[50px] w-[50px] h-full">
                <CreateFormBtn />
              </div>
            )}
          </Box>

          <Grid2
            id="testthis"
            display="flex"
            sx={{
              width: "100%",
              maxWidth: "550px",
              justifyContent: "center",
              mt: 1,
              gap: 2,
            }}
          >
            <Grid2
              size={{ xs: 12, sm: 12, md: 8, lg: 10 }}
              sx={{ display: "flex", alignItems: "center", gap: "12px" }}
            >
              <SearchInput />
              {!disableFilter && (
                <Grid2
                  sx={{ display: { xs: "flex", lg: "none" } }}
                  onClick={handleOpen}
                >
                  <Image
                    src="./images/home-page/FilterAA.svg"
                    width={51}
                    height={51}
                    alt=""
                    className="cursor-pointer border-[1px] border-[#c9c9c9] rounded-[15px] p-2"
                  />
                </Grid2>
              )}
            </Grid2>
          </Grid2>

          <Grid2
            container
            size={{ xs: 12, sm: 12, xl: 8, md: 8, lg: 10 }}
            sx={{
              width: "100%",
              mx: "auto",
              mt: 1,
              mb: 5,
              flexDirection: "column",
              gap: 2,
            }}
          >
            {datas?.pages ? (
              datas?.pages[0]?.length === 0 ? (
                <Typography>موردی یافت نشد</Typography>
              ) : (
                datas.pages.map((page, pageIndex) =>
                  page.map((data: any, index: number) => {
                    const key = `${pageIndex}-${index}`;
                    return (
                      <Grid2 sx={{ width: 1 }} key={key}>
                        <CartComponent
                          onCheck={(id: any, checked: any) =>
                            onCheck(id, checked)
                          }
                          data={data}
                          refreshGrid={handleRefreshGrid}
                        />
                        {index === 8 && (
                          <>
                            <Typography
                              component="h1"
                              ref={ref}
                              sx={{ height: 0 }}
                            />{" "}
                            <Box sx={{ width: "100%" }}>
                              {isFetchingNextPage ? <LinearProgress /> : null}
                            </Box>
                          </>
                        )}
                      </Grid2>
                    );
                  })
                )
              )
            ) : (
              <Grid2></Grid2>
            )}
          </Grid2>
        </Grid2>
        <BottomSheet open={open} onClose={handleClose}>
          <Grid2>{filterComponent}</Grid2>
        </BottomSheet>
      </Grid2>
      {filterComponent && (
        <Grid2
          width="100%"
          display={{
            xs: "none",
            md: "none",
            sm: "none",
            lg: "flex",
            xl: "flex",
          }}
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="center"
          sx={{
            backgroundColor: "white",
            borderRadius: "16px",
            gap: 1,
            m: 1,
            ml: 0,
            p: 2,
            maxWidth: "300px",
          }}
        >
          <Grid2
            sx={{
              width: "100%",
              minWidth: "200px",
              maxWidth: "300px",
            }}
          >
            {filterComponent}
          </Grid2>
        </Grid2>
      )}
    </Grid2>
  );
};

export default ListGrid;
