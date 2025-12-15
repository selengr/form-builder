// import { Suspense } from 'react';
// import ListGridWrapper from '@/templates/survey/ListGridWrapper';

// export default function MyAssessmentPage() {
//   return (
//     <Suspense>
//       <ListGridWrapper />
//     </Suspense>
//   );
// }


import ListGridWrapper from '@/templates/survey/ListGridWrapper';

import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';

import { fetchSurveyData, SURVEY_PURPOSE_QUERY_KEY } from '@/templates/survey/hooks/useGetSurveyPurpose';
import { fetchTargetPlatformData, TARGET_PLATFORM_QUERY_KEY } from '@/templates/survey/hooks/useGetTargetPlatform';


export default async function SurveyPage() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: SURVEY_PURPOSE_QUERY_KEY,
      queryFn: fetchSurveyData,
    }),
    queryClient.prefetchQuery({
      queryKey: TARGET_PLATFORM_QUERY_KEY,
      queryFn: fetchTargetPlatformData,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ListGridWrapper />
    </HydrationBoundary>
  );
}
