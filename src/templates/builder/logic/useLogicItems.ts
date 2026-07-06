'use client';

import { useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useQueryClient, QueryClient } from '@tanstack/react-query';
import { getCalculationListAction } from '../../../../actions/calculator/calculation';
import { getConditionListAction } from '../../../../actions/condition/getConditionListAction';
import { ICalculator } from '@/types/calculator';
import { IGetCondition } from '@/types/condition';

export const LOGIC_CALCULATORS_KEY = 'logic-calculators';
export const LOGIC_CONDITIONS_KEY = 'logic-conditions';

const EMPTY_CALCULATORS: ICalculator[] = [];
const EMPTY_CONDITIONS: IGetCondition[] = [];

export function invalidateLogicListQueries(queryClient: QueryClient, formId: string) {
  void queryClient.invalidateQueries({ queryKey: [LOGIC_CALCULATORS_KEY, formId] });
  void queryClient.invalidateQueries({ queryKey: [LOGIC_CONDITIONS_KEY, formId] });
}

export function useLogicItems(enabled = true) {
  const { id } = useParams();
  const formId = String(id ?? '');
  const queryClient = useQueryClient();

  const calculatorsQuery = useQuery({
    queryKey: [LOGIC_CALCULATORS_KEY, formId],
    queryFn: () => getCalculationListAction(formId),
    enabled: enabled && !!formId,
    staleTime: 0,
    gcTime: 600_000,
  });

  const conditionsQuery = useQuery({
    queryKey: [LOGIC_CONDITIONS_KEY, formId],
    queryFn: () => getConditionListAction(formId),
    enabled: enabled && !!formId,
    staleTime: 0,
    gcTime: 600_000,
  });

  const invalidate = useCallback(() => {
    invalidateLogicListQueries(queryClient, formId);
  }, [queryClient, formId]);

  return {
    calculators: calculatorsQuery.data ?? EMPTY_CALCULATORS,
    conditions: conditionsQuery.data ?? EMPTY_CONDITIONS,
    isLoading: calculatorsQuery.isLoading || conditionsQuery.isLoading,
    isError: calculatorsQuery.isError || conditionsQuery.isError,
    invalidate,
  };
}
