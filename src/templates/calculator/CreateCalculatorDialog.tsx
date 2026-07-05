'use client';

import { CgClose } from 'react-icons/cg';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { ICreateCalculatorDialogProps, IFieldQuestionData } from '@/types/calculator';
import AdvancedFormulaEditor from '@/components/calculator/AdvancedFormulaEditor';
import { CalculatorEditorDialogSkeleton } from '@/components/calculator/AdvancedFormulaEditorSkeleton';
import CalculatorEditorErrorState from '@/components/calculator/CalculatorEditorErrorState';
import CalculatorDialogShell from './CalculatorDialogShell';
import { fetchCalculatorsAction } from '../../../actions/calculator/calculator';

/** Set to false when API is available again */
const USE_FAKE_DATA = true;

const FAKE_QUESTION_LIST: IFieldQuestionData = {
  page: 0,
  rows: 10000,
  totalCount: 5,
  dataList: [
    {
      value: '{#q_10910}',
      caption: 'سوال متنی تست',
      elementStr: 'TEXT_FIELD',
      extMap: {
        QUESTION_TYPE: 'TEXT_FIELD',
        UNIC_NAME: '{#q_10910}',
        REQUIRED: 'false',
        TEXT_FIELD_PATTERN: 'SHORT_TEXT',
      } as any,
    },
    {
      value: '{#q_11012}',
      caption: 'جنسیت',
      elementStr: 'MULTIPLE_CHOICE',
      extMap: {
        QUESTION_TYPE: 'MULTIPLE_CHOICE',
        UNIC_NAME: '{#q_11012}',
        REQUIRED: 'false',
        MULTI_SELECT: 'false',
        OPTIONS: { '#op_1': [1, 'زن'], '#op_2': [2, 'مرد'] },
        OPTIONS_SIZE: 2,
      },
    },
    {
      value: '{#q_10992}',
      caption: 'سن',
      elementStr: 'TEXT_FIELD',
      extMap: {
        QUESTION_TYPE: 'TEXT_FIELD',
        UNIC_NAME: '{#q_10992}',
        REQUIRED: 'false',
        TEXT_FIELD_PATTERN: 'NUMBER',
      } as any,
    },
    {
      value: '{#q_11013}',
      caption: 'امتیاز رضایت',
      elementStr: 'RATING',
      extMap: {
        QUESTION_TYPE: 'RATING',
        UNIC_NAME: '{#q_11013}',
        REQUIRED: 'false',
      },
    },
    {
      value: '{#q_11020}',
      caption: 'طیف عددی',
      elementStr: 'SPECTRAL',
      extMap: {
        QUESTION_TYPE: 'SPECTRAL',
        UNIC_NAME: '{#q_11020}',
        REQUIRED: 'false',
        SPECTRAL_TYPE: 'NUMBER',
        SPECTRAL_START: '1',
        SPECTRAL_END: '10',
        STEP: '1',
      },
    },
  ],
};

const CreateCalculatorDialog: React.FC<ICreateCalculatorDialogProps> = ({ open, setOpen }) => {
  const { id } = useParams();
  const handleClose = () => setOpen(false);

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['calculators', id],
    queryFn: () => fetchCalculatorsAction(id as string),
    enabled: open && !!id && !USE_FAKE_DATA,
    gcTime: 10 * 60 * 1000,
    retry: USE_FAKE_DATA ? 0 : 3,
  });

  const questionList = USE_FAKE_DATA ? FAKE_QUESTION_LIST : data;
  const showLoading = !USE_FAKE_DATA && isLoading;
  const showError = !USE_FAKE_DATA && !!error;

  return (
    <CalculatorDialogShell open={open} onClose={handleClose}>
      {showLoading && <CalculatorEditorDialogSkeleton />}

      {showError && (
        <CalculatorEditorErrorState
          error={error}
          onRetry={() => refetch()}
          onClose={handleClose}
          isRetrying={isFetching && !isLoading}
        />
      )}

      {questionList && !showLoading && !showError && (
        <AdvancedFormulaEditor questionList={questionList} handleClose={handleClose} />
      )}
    </CalculatorDialogShell>
  );
};

export default CreateCalculatorDialog;
