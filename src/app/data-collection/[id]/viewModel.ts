import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
// actions
import statsService from '@/services/statsService';
import { getStatsDataAction, getFormDataAction } from '../../../../actions/dataCollection/stats';

export const useStatsViewModel = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState<any>({});
  const [headData, setHeadData] = useState<any[]>([]);
  const [allData, setAllData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const fetchFormData = async (id:string | string[]) => {
    try {
      setIsLoading(true);
      // @ts-ignore
      const data = await statsService.getFormData(id.toString());
      //  const data = await getFormDataAction(id);
      setFormData(data);
    } catch (error:any) {
      toast.error(error?.response?.data?.message?.[0]?.title || 'انجام عملیات با خطا مواجه شد');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStatsData = async (page: number, pageSize: number) => {
    try {
      setIsLoading(true);
      // @ts-ignore
      const data = await getStatsDataAction(id.toString(), page, pageSize);

      setHeadData(data.headData);
      setAllData(data.allData);
      setTotalItems(data.totalItems);
    } catch (error:any) {
        toast.error( error?.message || 'انجام عملیات با خطا مواجه شد');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFormData(id);
    fetchStatsData(page, pageSize);
  }, [id]);

  useEffect(() => {
    if (pageSize !== -1) {
      fetchStatsData(page, pageSize);
    }
  }, [page, pageSize]);

  return {
    formData,
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
