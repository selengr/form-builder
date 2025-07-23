import {useParams, useSearchParams} from 'next/navigation';
import {useQuery} from '@tanstack/react-query';
import {AxiosApi} from '@/services/axios/AxiosApi';


const fetchData = async (id: string | string[], admin: boolean) => {
    const filterModel = {
        searchFilterBoxList: [{ restrictionList: [] }],
        sortList: [{ fieldName: "id", type: "DSC" }],
        page: 0,
        rows: 1000,
    };
    
    const baseUrl = admin ? `/admin/report/solo/main-list/${id}` :  `/report/solo/main-list/${id}`;
    const queryString = `?searchFilterModel=${encodeURIComponent(JSON.stringify(filterModel))}`;
    const url = baseUrl + queryString;
    const response = await AxiosApi.get(url);
    return response.data.content;
}

export const useGetReportList = () => {
  const {id} = useParams();
  const searchParams = useSearchParams()
  const search = searchParams.get('rep')
  const admin = search === "list"

  return useQuery({
    queryKey: ["Report_List"],
    queryFn: () => fetchData(id, admin),
    staleTime: 0,
    gcTime: 600000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 3
  });
};
