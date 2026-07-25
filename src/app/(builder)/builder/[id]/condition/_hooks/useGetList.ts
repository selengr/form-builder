// import { useParams } from 'next/navigation';
// import { useQuery } from '@tanstack/react-query';
// // action
// import { getConditionListAction } from '../../../../../../../actions/condition/getConditionListAction';

// export const useGetList = () => {
//   const { id } = useParams();
//   return useQuery({
//     queryKey: ['Condition_List', id],
//     queryFn: () => getConditionListAction(String(id)),
//     staleTime: 0,
//     gcTime: 600000,
//     refetchOnWindowFocus: true,
//     refetchOnReconnect: true,
//     retry: 3,
//   });
// };
