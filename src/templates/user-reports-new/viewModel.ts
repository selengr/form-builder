import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { getUserReportsDataAction } from '@actions/user-reports/getUserReportsDataAction';

export const useStatsViewModel = () => {
  const [headData, setHeadData] = useState<any[]>([]);
  const [allData, setAllData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalItems, setTotalItems] = useState<number>(0);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const fetchUserReportData = async (page: number, pageSize: number) => {
    try {
      setIsLoading(true);
      const data = await getUserReportsDataAction(page, pageSize);
      if (!data.success) {
        toast.error(data?.message || 'انجام عملیات با خطا مواجه شد');
        return;
      }
      setHeadData(data.headData!);
      setAllData(data.allData);
      setTotalItems(data.totalItems);
    } catch (error: any) {
      toast.error(error?.message || 'انجام عملیات با خطا مواجه شد');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserReportData(page, pageSize);
  }, []);

  useEffect(() => {
    if (pageSize !== -1) {
      fetchUserReportData(page, pageSize);
    }
  }, [page, pageSize]);

  return {
    headData,
    allData,
    isLoading,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalItems,
  };
};
