'use server';

import { fetchAnswersDataSheet } from '@/lib/answersDataSheet';

export async function getStatsDataAction(
  id: string,
  page: number = 1,
  pageSize: number = 25,
) {
  return fetchAnswersDataSheet('/report/solo/answers-data-sheet', id, page, pageSize);
}
