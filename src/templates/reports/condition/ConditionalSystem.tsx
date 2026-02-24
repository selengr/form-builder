'use client';
import { toast } from 'sonner';
import { idGenerator } from '@/lib';
import { useRef, useState } from 'react';
import { FormProvider, useWatch } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import { Box, Button, Stack, Typography } from '@mui/material';

import { SubCondition } from './SubCondition';
// components
import { RHFSwitch } from '@/components/hook-form';
import { CircleDivider } from '@/components/condition/CircleDivider';
import { SubmitButtons } from '@/components/condition/form/SubmitButtons';
import AdvancedEditor from '@/components/AdvancedTextareaEditor/AdvancedTextareaEditorV2';
// types
import { IConditionalSystemProps, IPostCondition } from '@/types/conditionReportSolo';
// lib
import { formatContainText } from '@/lib/formatContainText';
import { TConditionData, type TConditionFormData, TSubConditionData } from '@/lib/CreateSoloReportSchema';
// hooks
import { usePostCondition } from '@/app/reports/create-solo/[id]/_hooks/usePostCondition';
import { useGetQacWithOutFilter } from '@/app/reports/create-solo/[id]/_hooks/useGetQacWithOutFilter';
import { useGetOnlyAllQuestions } from '@/app/reports/create-solo/[id]/_hooks/useGetOnlyAllQuestions';
import { useGetOnlyAllCalculation } from '@/app/reports/create-solo/[id]/_hooks/useGetOnlyAllCalculation';
import { createNewSubCondition, useConditionalForm } from '@/app/reports/create-solo/[id]/_hooks/useConditionalForm';

export const ConditionalSystem: React.FC<IConditionalSystemProps> = ({ handleClose, condition, isEdit = false }) => {
  const { id } = useParams();
  const { refresh } = useRouter();
  const returnTextEdit = isEdit ? JSON.parse(condition?.returnText) : undefined;
  const editorMetaRef = useRef<Record<number, { text: string; variables: any[] }>>({});

  const { methods, conditions, handleAddCondition, handleRemoveCondition, handleAddSubCondition, handleRemoveSubCondition } = useConditionalForm(condition);

  const { onlyAllCalculationOptions, isFetchingOnlyAllCalculation } = useGetOnlyAllCalculation();
  const { qacWithOutFilterOptions, isFetchingQacWithOutFilter, qacWithOutFilter } = useGetQacWithOutFilter();
  const { onlyAllQuestions, onlyAllDateOptions, onlySomeQuestionsOptions, isFetchingOnlyAllQuestions } = useGetOnlyAllQuestions();

  const postCondition = usePostCondition(isEdit);

  const handleReturnTextChange = (data: any, index: number) => {
    methods.setValue(`conditions.${index}.returnText`, data.html);

    editorMetaRef.current[index] = {
      text: data.text ?? "",
      variables: data.variables ?? [],
    };

    methods.clearErrors(`conditions.${index}.returnText` as any);
  };

  const onSubmit = (input: TConditionFormData, e: any) => {
    e?.preventDefault();

    input.conditions.forEach((_, index) => {
      const meta = editorMetaRef.current[index] ?? { text: "", variables: [] };
      const text = (meta.text ?? "").trim();
      const variables = Array.isArray(meta.variables) ? meta.variables : [];
      const selectedCount = variables.filter((v: any) => (v?.unique_name ?? "").trim()).length;
      const hasUnselected = variables.some((v: any) => !(v?.unique_name ?? "").trim());

      const isEmpty = text.length === 0 && selectedCount === 0;
      if (isEmpty) {
        toast.error("نوشتن متن الزامی است (یا حداقل یک متغیر انتخاب کنید).");
        return;
      } else if (hasUnselected) {
        toast.error("شما یک یا چند متغیر را انتخاب نکرده‌اید.");
        return;
      }
    });

    const transformInputToOutput = (input: TConditionFormData): any => {
      return input.conditions.map((condition: TConditionData, index) => {
        const { subConditions, returnText, displayIf } = condition;

        const conditionSubConditions = displayIf ? subConditions : 'false';

        const conditionFormula = displayIf
          ? Array.isArray(subConditions) &&
          subConditions
            .map((subCondition: TSubConditionData) => {
              const conditionType = subCondition.conditionType?.split('@')[0];
              const questionType = subCondition.questionType?.split('@')[0];
              const operatorType = subCondition.operatorType?.split('@')[0];
              const value = typeof subCondition.value !== 'object' ? subCondition.value?.split('@')[0] : subCondition.value;
              const logicalOperator = subCondition.logicalOperator?.split('@')[0];

              let formattedValue: string;

              if (operatorType === 'OPTION') {
                if (typeof subCondition.value === 'object') {
                  formattedValue = `{${Array.isArray(value) && value?.map((item: string) => item?.split('@')[0])}}`;
                } else formattedValue = `{${value}}`;
              } else if (operatorType === 'VALUE') {
                formattedValue = `{#v_${value}}`;
              } else if (operatorType === 'TEXT') {
                if (conditionType === '#startWithText' || conditionType === '#endWithText') {
                  const InfoField = questionType.split('*')[0]
                  if (InfoField === "INFO_FIELD") {
                    formattedValue = `{"#"}`;
                  } else {
                    formattedValue = `{"${value}"}`;
                  }
                } else if (conditionType === '!#containAnyText' || conditionType === '#containAnyText') {
                  formattedValue = `{${formatContainText(value as string)}}`;
                } else if (conditionType === '#lenEqualText' || conditionType === '#lenGraterThanText' || conditionType === '!#lenGraterThanText') {
                  formattedValue = `{#v_${value}}`;
                } else {
                  formattedValue = value as string;
                }
              } else if (operatorType === 'DATE') {
                formattedValue = `{#v_"${value}"}`;
              } else {
                formattedValue = value as string;
              }

              const baseCondition = `${conditionType}(${questionType.split('*')[1]},${formattedValue})`;

              return logicalOperator ? ` ${logicalOperator} ${baseCondition}` : baseCondition;
            })
            .join('')
          : 'true';

        return {
          formBuilderId: Number(id),
          conditionFormula: conditionFormula,
          returnText,
          frontConditionData: JSON.stringify({
            ...input.conditions[index],
            subConditions: conditionSubConditions,
          }),
          // frontConditionData: JSON.stringify(input.conditions[index]),
          ...(isEdit && { id: Number(condition.id) }),
        };
      });
    };

    const output: IPostCondition[] = transformInputToOutput(input);
    postCondition.mutate(
      { data: output },
      {
        onSuccess: () => {
          refresh();
          handleClose();
        },
        onError: (error: any) => {
          toast.error(error);
        },
      },
    );
  };

  const handleConditionDisplay = (index: number) => {
    if (methods.getValues(`conditions.${index}.displayIf`)) {
      methods.setValue(`conditions.${index}.displayIf`, false);
      methods.setValue(`conditions.${index}.subConditions`, 'false');
    } else {
      methods.setValue(`conditions.${index}.displayIf`, true);
      methods.setValue(`conditions.${index}.subConditions`, [createNewSubCondition()]);
    }
  };

  const ConditionDisplayChecker = ({ index }: { index: number }) => {
    const displayIf = useWatch({
      control: methods.control,
      name: `conditions.${index}.displayIf`,
      defaultValue: false,
    });
    const subConditions = useWatch({
      control: methods.control,
      name: `conditions.${index}.subConditions`,
    });

    return displayIf ? (
      <>
        {Array.isArray(subConditions) &&
          subConditions.map((subCondition, subIndex) => (
            <SubCondition
              key={subCondition.id}
              index={index}
              subIndex={subIndex}
              onAddSubCondition={() => handleAddSubCondition(index, subIndex)}
              onRemoveSubCondition={() => handleRemoveSubCondition(index, subIndex)}
              qacWithOutFilterOptions={qacWithOutFilterOptions}
              isFetchingQacWithOutFilter={isFetchingQacWithOutFilter}
              onlySomeQuestionsOptions={onlySomeQuestionsOptions}
              isFetchingOnlyAllQuestions={isFetchingOnlyAllQuestions}
              onlyAllCalculationOptions={onlyAllCalculationOptions}
              isFetchingOnlyAllCalculation={isFetchingOnlyAllCalculation}
              onlyAllQuestions={onlyAllQuestions}
              onlyAllDateOptions={onlyAllDateOptions}
            />
          ))}
      </>
    ) : null;
  };


  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', direction: 'ltr' }}>
      <Typography variant='subtitle1' sx={{ display: 'flex', justifyContent: 'center', color: '#404040', fontWeight: 700 }}>
        افزودن خرده‌گزارش
      </Typography>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {conditions.map((condition, index) => (
            <Box key={idGenerator()} sx={{ width: '100%' }}>
              <Box
                sx={{
                  ml: { xs: 0, md: 2 },
                  display: 'flex',
                  alignItems: 'start',
                  gap: 1,
                  position: 'relative',
                  flexDirection: { xs: 'column' },
                }}>

                <AdvancedEditor
                  label="نمایش بده"
                  qacWithOutFilter={qacWithOutFilter}
                  initialHTML={returnTextEdit ? returnTextEdit : null}
                  onChange={(data) => handleReturnTextChange(data, index)}
                />
                {/* {errors ? (
              <Typography sx={{ color: "#FA4D56", fontSize: "12px", mt: 1 }}>
                {String(errors)}
              </Typography>
            ) : null} */}


                <Stack sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <RHFSwitch
                    label=''
                    name={`conditions.${index}.displayIf`}
                    labelPlacement='start'
                    sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-between' }}
                    onClick={() => handleConditionDisplay(index)}
                  />
                  <Typography sx={{ color: '#393939', fontSize: '14px', ml: 1 }}>نمایش بده به شرطی که</Typography>
                </Stack>
              </Box>

              <ConditionDisplayChecker index={index} />
              <Box
                sx={{
                  ml: { xs: 0, md: 2 },
                  display: 'flex',
                  alignItems: 'start',
                  gap: 1,
                  position: 'relative',
                  flexDirection: { xs: 'column' },
                }}>
                {/* <Typography sx={{ color: "#393939", fontSize: "14px",ml:-1.3 }}>نمایش بده:</Typography>
                <TextFieldController  sx={{ minWidth: 240, ml: 0 }} name={`conditions.${index}.returnText`} type="string" /> */}

                {/*   <AdvancedTextareaEditor
              label="در غیر اینصورت نمایش بده:"
              onDataChange={(data) => handleElseReturnTextChange(data, index)}
              initialData={elseReturnTextEdit}
              qacWithOutFilter={qacWithOutFilter}
            />
         */}

                {index !== 0 && (
                  <Box
                    sx={{
                      width: '100%',
                      height: '50px',
                      marginTop: 1,
                    }}>
                    <Button
                      onClick={() => handleRemoveCondition(index)}
                      sx={{
                        width: 113,
                        height: '50px',
                        bgcolor: '#FA4D560D',
                        borderRadius: '8px',
                        position: { lg: 'absolute' },
                        right: { lg: 10 },
                        bottom: 0,
                        border: '1px solid #FA4D56',
                        '&:hover': { bgcolor: '#FA4D560D' },
                      }}>
                      <Typography sx={{ color: '#FA4D56', fontSize: '14px' }}>حذف این خرده‌گزارش</Typography>
                    </Button>
                  </Box>
                )}
              </Box>
              <CircleDivider />
            </Box>
          ))}
          {!isEdit && (
            <Button
              variant='outlined'
              onClick={handleAddCondition}
              sx={{
                ml: 2,
                height: 50,
                maxWidth: 155,
                color: 'white',
                bgcolor: '#1758BA',
                borderRadius: '8px',
              }}>
              افزودن شرط جدید
            </Button>
          )}
          <SubmitButtons isLoading={postCondition.isPending} handleClose={handleClose} />
        </form>
      </FormProvider>
    </Box>
  );
};
