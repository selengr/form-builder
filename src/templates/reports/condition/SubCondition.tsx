'use client';
import Image from 'next/image';
import { useFormContext, useWatch } from 'react-hook-form';
import { Box, IconButton, Typography } from '@mui/material';
import { getCondition, getInput, getQuestion } from './GetConditionInput';
import { SelectController } from '@/components/condition/form/SelectController';
import { MediaConditionTip } from '@/components/condition/MediaConditionTip';
import {
  INFO_LIKE_DUMMY_CONDITION,
  INFO_LIKE_DUMMY_OPERATOR,
  INFO_LIKE_DUMMY_VALUE,
  isInfoLikeQuestion,
  isMediaUploadQuestion,
} from '@/lib/conditionQuestionTypes';

type SubConditionProps = {
  index: number;
  subIndex: number;
  onAddSubCondition: () => void;
  onRemoveSubCondition: () => void;
  qacWithOutFilterOptions: any[];
  isFetchingQacWithOutFilter: boolean;
  onlySomeQuestionsOptions: any[];
  isFetchingOnlyAllQuestions: boolean;
  onlyAllCalculationOptions: any[];
  isFetchingOnlyAllCalculation: boolean;
  onlyAllQuestions: any[];
  onlyAllDateOptions: any[];
};

export const SubCondition: React.FC<SubConditionProps> = ({
  index,
  subIndex,
  onAddSubCondition,
  onRemoveSubCondition,
  qacWithOutFilterOptions,
  isFetchingQacWithOutFilter,
  onlySomeQuestionsOptions,
  isFetchingOnlyAllQuestions,
  onlyAllCalculationOptions,
  isFetchingOnlyAllCalculation,
  onlyAllQuestions,
  onlyAllDateOptions,
}) => {
  const { control, setValue, getValues } = useFormContext();
  const currentValues = useWatch({
    control,
    name: `conditions.${index}.subConditions.${subIndex}`,
  });
  const isMediaUpload = isMediaUploadQuestion(currentValues?.questionType);

  const applyInfoLikeDefaults = () => {
    setValue(`conditions.${index}.subConditions.${subIndex}.operatorType`, INFO_LIKE_DUMMY_OPERATOR);
    setValue(`conditions.${index}.subConditions.${subIndex}.conditionType`, INFO_LIKE_DUMMY_CONDITION);
    setValue(`conditions.${index}.subConditions.${subIndex}.value`, INFO_LIKE_DUMMY_VALUE);
  };

  return (
    <Box
      sx={{
        mb: 1,
        ml: { md: 2 },
        mt: 1,
        display: 'flex',
        flexDirection: 'row',
      }}>
      <Box sx={{ display: 'flex', alignItems: 'start' }}>
        {subIndex === 0 && (
          <Typography
            sx={{
              color: '#393939',
              fontSize: '14px',
              width: { xs: 22, md: 83 },
              pt: 2,
            }}>
            اگر
          </Typography>
        )}
        {subIndex > 0 && (
          <SelectController
            name={`conditions.${index}.subConditions.${subIndex}.logicalOperator`}
            options={[
              { value: '&&', label: 'و' },
              { value: '||', label: 'یا' },
            ]}
            sx={{ minWidth: 78, maxWidth: 78, mr: 1, ml: '-4px', pr: '10px' }}
          />
        )}
      </Box>

      <Box
        rowGap={3}
        columnGap={2}
        sx={{
          gap: 1,
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
        }}>
        <SelectController
          name={`conditions.${index}.subConditions.${subIndex}.questionType`}
          options={qacWithOutFilterOptions}
          isLoading={isFetchingQacWithOutFilter}
          sx={{
            width: { sm: '100%', md: '100%' },
            minWidth: 240,
            maxWidth: 240,
            flexShrink: 0,
          }}
          onChange={(e:any) => {
              if (isInfoLikeQuestion(e.target?.value)) {
                applyInfoLikeDefaults();
              } else {
                setValue(`conditions.${index}.subConditions.${subIndex}.operatorType`, '');
                setValue(`conditions.${index}.subConditions.${subIndex}.conditionType`, '');
                setValue(`conditions.${index}.subConditions.${subIndex}.value`, '');
              }
            }}
        />
        <SelectController
          name={`conditions.${index}.subConditions.${subIndex}.operatorType`}
          options={getQuestion(currentValues.questionType, currentValues)}
          placeholder="گویه"
          forcePlaceholder={isMediaUpload}
          sx={{
            width: { sm: '100%', md: '22%' },
            minWidth: 156,
            flexShrink: 0,
            ...(isMediaUpload && {
              backgroundColor: '#EEF1F6',
              '&.Mui-disabled': { backgroundColor: '#EEF1F6', opacity: 1 },
            }),
          }}
          onChange={() => {
            const questionType = getValues(`conditions.${index}.subConditions.${subIndex}.questionType`)
            if (isInfoLikeQuestion(questionType)) {
              setValue(`conditions.${index}.subConditions.${subIndex}.conditionType`, INFO_LIKE_DUMMY_CONDITION);
              setValue(`conditions.${index}.subConditions.${subIndex}.value`, INFO_LIKE_DUMMY_VALUE);
            } else {
              setValue(`conditions.${index}.subConditions.${subIndex}.conditionType`, '');
              setValue(`conditions.${index}.subConditions.${subIndex}.value`, '');
            }
          }}
          isOperator={true}
          disabled={!currentValues.questionType || isMediaUpload}
        />
        <SelectController
          name={`conditions.${index}.subConditions.${subIndex}.conditionType`}
          options={getCondition(currentValues.questionType, currentValues.operatorType, currentValues)}
          placeholder="عملگر"
          forcePlaceholder={isMediaUpload}
          sx={{
            width: { sm: '100%', md: '22%' },
            minWidth: 156,
            flexShrink: 0,
            ...(isMediaUpload && {
              backgroundColor: '#EEF1F6',
              '&.Mui-disabled': { backgroundColor: '#EEF1F6', opacity: 1 },
            }),
          }}
          onChange={() => {
           const questionType = getValues(`conditions.${index}.subConditions.${subIndex}.questionType`)
            if (isInfoLikeQuestion(questionType)) {
              setValue(`conditions.${index}.subConditions.${subIndex}.value`, INFO_LIKE_DUMMY_VALUE);
            } else {
              setValue(`conditions.${index}.subConditions.${subIndex}.value`, '');
            }
          }}
          isOperator={true}
          disabled={!currentValues.operatorType || isMediaUpload}
        />
        {isMediaUpload ? (
          <Box sx={{ minWidth: 156, flex: 1, height: 50, borderRadius: '12px', bgcolor: '#EEF1F6', border: '1px solid #E5E9F0' }} />
        ) : getInput(
          currentValues.questionType,
          currentValues.operatorType,
          currentValues.conditionType,
          {
            name: `conditions.${index}.subConditions.${subIndex}.value`,
          },
          {
            onlySomeQuestionsOptions,
            isFetchingOnlyAllQuestions,
            onlyAllCalculationOptions,
            isFetchingOnlyAllCalculation,
            onlyAllQuestions,
            onlyAllDateOptions,
            control,
            setValue,
          },
        )}
        {isMediaUpload && (
          <Box sx={{ flexBasis: '100%' }}>
            <MediaConditionTip />
          </Box>
        )}
        <Box
          sx={{
            display: 'flex',
            gap: 1,
          }}>
          <IconButton
            onClick={onAddSubCondition}
            sx={{
              width: '50px',
              height: '50px',
              bgcolor: '#1758BA0D',
              borderRadius: '10px',
              border: '1px solid #1758BA',
            }}>
            <Image src='/images/home-page/Add-fill.svg' alt='' width={22} height={22} unoptimized/>
          </IconButton>
          {subIndex !== 0 && (
            <IconButton
              onClick={onRemoveSubCondition}
              sx={{
                width: '50px',
                height: '50px',
                bgcolor: '#FA4D560D',
                borderRadius: '10px',
                border: '1px solid #FA4D56',
                '&: hover': {
                  bgcolor: '#FA4D560D',
                },
              }}>
              <Image src='/images/home-page/trash.svg' alt='' width={24} height={24} unoptimized/>
            </IconButton>
          )}
        </Box>
      </Box>
    </Box>
  );
};
