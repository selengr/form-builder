import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
// actions
import { getStatsDataAction } from '../../../../actions/dataCollection/stats';

// --------------------------------------------------------
export const useStatsViewModel = () => {
  const { id } = useParams();
  const searchParams = useSearchParams()
  const name = searchParams.get('name');

  const [page, setPage] = useState<number>(1);
  const [allData, setAllData] = useState<any[]>([]);
  const [headData, setHeadData] = useState<any[]>([]);
  const [pageSize, setPageSize] = useState<number>(25);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);


  const fetchStatsData = async (page: number, pageSize: number) => {
    try {
       setIsLoading(true);
       // @ts-ignore
       const data = await getStatsDataAction(id.toString(), page, pageSize);

       setAllData(data.allData);
       setHeadData(data.headData);
       setTotalItems(data.totalItems);
    } catch (error:any) {
       toast.error( error?.message || 'انجام عملیات با خطا مواجه شد');
    } finally {
       setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatsData(page, pageSize);
  }, [id]);

  useEffect(() => {
    if (pageSize !== -1) {
      fetchStatsData(page, pageSize);
    }
  }, [page, pageSize]);

  return {
    page,
    name,
    setPage,
    allData,
    headData,
    pageSize,
    isLoading,
    totalItems,
    setPageSize,
  };
};
