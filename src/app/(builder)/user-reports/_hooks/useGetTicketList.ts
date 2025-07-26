import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { AxiosApi } from '@/services/axios/AxiosApi';

const fetchData = async (id: string | string[]) => {
    const filterModel = {
        searchFilterBoxList: [{ restrictionList: [] }],
        sortList: [{ fieldName: "id", type: "DSC" }],
        page: 0,
        rows: 10,
    };

    const baseUrl = `/admin/destroy-form/list-ticket/${id}`;
    const queryString = `?searchFilterModel=${encodeURIComponent(JSON.stringify(filterModel))}`;
    const url = baseUrl + queryString;
    const response = await AxiosApi.get(url);
    return response.data.content;
}

export const useGetTicketList = (id:string | string[]) => {

    return useQuery({
        queryKey: ["Ticket_List"],
        queryFn: () => fetchData(id),
        staleTime: 0,
        gcTime: 600000,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        retry: 3,
        enabled : !!id
    });
};
