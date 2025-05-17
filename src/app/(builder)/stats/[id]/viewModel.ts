import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import statsService from '@/services/statsService';

export const useStatsViewModel = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState<any>({});
    const [headData, setHeadData] = useState<any[]>([]);
    const [allData, setAllData] = useState<any[]>([]);
    const [visibleData, setVisibleData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(-1);

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

    const fetchStatsData = async () => {
        try {
            setIsLoading(true);
            // @ts-ignore
            const data = await statsService.getStatsData(id.toString());
            setHeadData(data.headData);
            setAllData(data.allData);
        } catch (error) {
            console.error('Error fetching stats data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        (async () => {
            await fetchFormData();
            await fetchStatsData();
        })();
    }, [id]);

    useEffect(() => {
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        setVisibleData(allData.slice(start, end));
    }, [page, pageSize, allData]);

    return {
        formData,
        headData,
        allData,
        visibleData,
        isLoading,
        page,
        setPage,
        pageSize,
        setPageSize,
    };
};
