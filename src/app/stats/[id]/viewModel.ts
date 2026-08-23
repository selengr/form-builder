import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
// actions
// import statsService from '@/services/statsService';
import { getStatsDataAction } from '@actions/report/stats';

export const useStatsViewModel = () => {
  const { id } = useParams();
  // const [formData, setFormData] = useState<any>({});
  const [headData, setHeadData] = useState<any[]>([]);
  const [allData, setAllData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // const fetchFormData = async () => {
  //   try {
  //     setIsLoading(true);
  //     // @ts-ignore
  //     const data = await statsService.getFormData(id.toString());
  //     setFormData(data);
  //   } catch (error) {
  //     console.error('Error fetching form data:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

 const fetchStatsData = async (page: number, pageSize: number) => {
  setIsLoading(true);
  try {
    const res = await getStatsDataAction(id.toString(), page, pageSize);
    if (res.success === false) {
      throw new Error(res.message || 'خطا در دریافت اطلاعات');
    }

    setHeadData(res.data!.headData);
    setAllData(res.data?.allData);
    setTotalItems(res.data?.totalItems);

  } catch (error: any) {
    console.error('Error fetching stats data:', error);
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    // fetchFormData();
    fetchStatsData(page, pageSize);
  }, [id]);

  useEffect(() => {
    if (pageSize !== -1) {
      fetchStatsData(page, pageSize);
    }
  }, [page, pageSize]);

  const refetchStatsData = () => fetchStatsData(page, pageSize);

  return {
    // formData,
    headData,
    allData,
    isLoading,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalItems,
    refetchStatsData
  };
};
