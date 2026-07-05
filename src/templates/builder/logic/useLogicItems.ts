'use client';

import { useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCalculationListAction } from '../../../../actions/calculator/calculation';
import { getConditionListAction } from '../../../../actions/condition/getConditionListAction';
import { ICalculator } from '@/types/calculator';
import { IGetCondition } from '@/types/condition';

export const LOGIC_CALCULATORS_KEY = 'logic-calculators';
export const LOGIC_CONDITIONS_KEY = 'logic-conditions';

// const EMPTY_CALCULATORS: ICalculator[] = [];
const EMPTY_CALCULATORS: ICalculator[] = 
[{"id":1804,"name":"test fake data","formBuilderId":7378,"theFormula":"{#q_11012}+{#v_36}*{#v_9}+#avgNumber({{#q_11013},{#q_11012}})","frontCalcData":"[{\"type\":\"NEW_FIELD\",\"content\":\"one\",\"id\":\"{#q_11012}\",\"mainIndex\":0,\"isInAvg\":false},{\"type\":\"OPERATOR\",\"content\":\"+\"},{\"type\":\"NUMBER\",\"content\":\"36\"},{\"type\":\"OPERATOR\",\"content\":\"*\"},{\"type\":\"NUMBER\",\"content\":\"9\"},{\"type\":\"OPERATOR\",\"content\":\"+\"},{\"type\":\"NEW_FnFx\",\"content\":\"میانگین()\",\"id\":\"select_1783026062873_581\",\"mainIndex\":2},{\"type\":\"AVG_PARENTHESIS\",\"content\":\"(\"},{\"type\":\"NEW_FIELD\",\"content\":\"two\",\"id\":\"{#q_11013}\",\"mainIndex\":4,\"isInAvg\":true},{\"type\":\"NEW_FIELD\",\"content\":\"one\",\"id\":\"{#q_11012}\",\"mainIndex\":6,\"isInAvg\":true},{\"type\":\"AVG_PARENTHESIS\",\"content\":\")\"}]","label":"7378@akbTiA36-ts"}]
// const EMPTY_CONDITIONS: IGetCondition[] = [];
const EMPTY_CONDITIONS: any[] = 
[{"id":1621,"frontConditionData":"{\"subConditions\":[{\"logicalOperator\":\"\",\"questionType\":\"MULTIPLE_CHOICE*{#q_11012}@one\",\"operatorType\":\"OPTION@گزینه\",\"conditionType\":\"!#equalMultiChoiceSingle@نابرابر با\",\"value\":\"#op_9279@گزینه 2\",\"id\":2501},{\"logicalOperator\":\"&&\",\"questionType\":\"TEXT_FIELD*{#q_10992}@tuutu\",\"operatorType\":\"VALUE@ارزش\",\"conditionType\":\"#lenGraterThanText@طول متن بیشتر از\",\"value\":\"333\",\"id\":4173}],\"returnQuestionId\":\"{#q_11013}@two\",\"elseQuestionId\":\"{#q_10992}@tuutu\",\"id\":1621}"}]
// Dev sample — replace EMPTY_CONDITIONS fallback temporarily to preview card UI:

export function useLogicItems(enabled = true) {
  const { id } = useParams();
  const formId = String(id ?? '');
  const queryClient = useQueryClient();

  // const calculatorsQuery = useQuery({
  //   queryKey: [LOGIC_CALCULATORS_KEY, formId],
  //   queryFn: () => getCalculationListAction(formId),
  //   enabled: enabled && !!formId,
  //   staleTime: 0,
  //   gcTime: 600_000,
  // });

  // const conditionsQuery = useQuery({
  //   queryKey: [LOGIC_CONDITIONS_KEY, formId],
  //   queryFn: () => getConditionListAction(formId),
  //   enabled: enabled && !!formId,
  //   staleTime: 0,
  //   gcTime: 600_000,
  // });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [LOGIC_CALCULATORS_KEY, formId] });
    queryClient.invalidateQueries({ queryKey: [LOGIC_CONDITIONS_KEY, formId] });
  }, [queryClient, formId]);

  return {
    calculators: EMPTY_CALCULATORS,
    conditions: EMPTY_CONDITIONS,
    isLoading: false,
    isError: false,
    invalidate,
  };
}


// 'use client';

// import { useCallback } from 'react';
// import { useParams } from 'next/navigation';
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { getCalculationListAction } from '../../../../actions/calculator/calculation';
// import { getConditionListAction } from '../../../../actions/condition/getConditionListAction';
// import { ICalculator } from '@/types/calculator';
// import { IGetCondition } from '@/types/condition';

// export const LOGIC_CALCULATORS_KEY = 'logic-calculators';
// export const LOGIC_CONDITIONS_KEY = 'logic-conditions';

// const EMPTY_CALCULATORS: ICalculator[] = [];
// // const EMPTY_CONDITIONS: IGetCondition[] = [];
// const EMPTY_CONDITIONS: any[] = 
// [{"id":1621,"frontConditionData":"{\"subConditions\":[{\"logicalOperator\":\"\",\"questionType\":\"MULTIPLE_CHOICE*{#q_11012}@one\",\"operatorType\":\"OPTION@گزینه\",\"conditionType\":\"!#equalMultiChoiceSingle@نابرابر با\",\"value\":\"#op_9279@گزینه 2\",\"id\":2501},{\"logicalOperator\":\"&&\",\"questionType\":\"TEXT_FIELD*{#q_10992}@tuutu\",\"operatorType\":\"VALUE@ارزش\",\"conditionType\":\"#lenGraterThanText@طول متن بیشتر از\",\"value\":\"333\",\"id\":4173}],\"returnQuestionId\":\"{#q_11013}@two\",\"elseQuestionId\":\"{#q_10992}@tuutu\",\"id\":1621}"}]
// // Dev sample — replace EMPTY_CONDITIONS fallback temporarily to preview card UI:
// export function useLogicItems(enabled = true) {
//   const { id } = useParams();
//   const formId = String(id ?? '');
//   const queryClient = useQueryClient();

//   const calculatorsQuery = useQuery({
//     queryKey: [LOGIC_CALCULATORS_KEY, formId],
//     queryFn: () => getCalculationListAction(formId),
//     enabled: enabled && !!formId,
//     staleTime: 0,
//     gcTime: 600_000,
//   });

//   const conditionsQuery = useQuery({
//     queryKey: [LOGIC_CONDITIONS_KEY, formId],
//     queryFn: () => getConditionListAction(formId),
//     enabled: enabled && !!formId,
//     staleTime: 0,
//     gcTime: 600_000,
//   });

//   const invalidate = useCallback(() => {
//     queryClient.invalidateQueries({ queryKey: [LOGIC_CALCULATORS_KEY, formId] });
//     queryClient.invalidateQueries({ queryKey: [LOGIC_CONDITIONS_KEY, formId] });
//   }, [queryClient, formId]);

//   return {
//     calculators: calculatorsQuery.data ?? EMPTY_CALCULATORS,
//     conditions: conditionsQuery.data ?? EMPTY_CONDITIONS,
//     isLoading: calculatorsQuery.isLoading || conditionsQuery.isLoading,
//     isError: calculatorsQuery.isError || conditionsQuery.isError,
//     invalidate,
//   };
// }
