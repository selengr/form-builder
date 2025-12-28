import { Suspense } from 'react';
import ListGridWrapper from '@/templates/survey/ListGridWrapper';

export default function SurveyPage() {
  return (
    <Suspense>
      <ListGridWrapper />
    </Suspense>
  );
}



// import {
//   HydrationBoundary,
//   QueryClient,
//   dehydrate,
// } from '@tanstack/react-query';

// import { fetchSurveyData, SURVEY_PURPOSE_QUERY_KEY } from '@/templates/survey/hooks/useGetSurveyPurpose';
// import { fetchTargetPlatformData, TARGET_PLATFORM_QUERY_KEY } from '@/templates/survey/hooks/useGetTargetPlatform';

// export const dynamic = 'force-dynamic';

// export default async function SurveyPage() {
//   const queryClient = new QueryClient();

//   await Promise.all([
//     queryClient.prefetchQuery({
//       queryKey: SURVEY_PURPOSE_QUERY_KEY,
//       queryFn: fetchSurveyData,
//     }),
//     queryClient.prefetchQuery({
//       queryKey: TARGET_PLATFORM_QUERY_KEY,
//       queryFn: fetchTargetPlatformData,
//     }),
//   ]);

//   return (
//     <HydrationBoundary state={dehydrate(queryClient)}>
//       <ListGridWrapper />
//     </HydrationBoundary>
//   );
// }
