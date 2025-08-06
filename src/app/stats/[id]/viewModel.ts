import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import statsService from '@/services/statsService';

export const useStatsViewModel = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState<any>({});
  const [headData, setHeadData] = useState<any[]>([]);
  const [allData, setAllData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const fetchFormData = async () => {
    try {
      setIsLoading(true);
      // @ts-ignore
      const data = await statsService.getFormData(id.toString());
      setFormData(data);
    } catch (error) {
      console.error('Error fetching form data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStatsData = async (page: number, pageSize: number) => {
    try {
      setIsLoading(true);
      // @ts-ignore
      const data = await statsService.getStatsData(id.toString(), page, pageSize);
      setHeadData(data.headData);
      setAllData(data.allData);
      setTotalItems(data.totalItems);
    } catch (error) {
      console.error('Error fetching stats data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFormData();
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
