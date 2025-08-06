'use client';

import { CgClose } from 'react-icons/cg';
import Dialog from '@mui/material/Dialog';
import { IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { AxiosApi } from '@/services/axios/AxiosApi';
import DialogContent from '@mui/material/DialogContent';

import { ICreateCalculatorDialogProps } from '@/types/calculator';
import AdvancedFormulaEditor from '@/components/calculator/AdvancedFormulaEditor';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  direction: 'ltr',
  maxHeight: '75vh',
  scrollbarWidth: 'thin',
  maxWidth: '100%',
  padding: theme.spacing(3.8),
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  overflow: 'hidden',
  scrollbarWidth: 'none',
  '& .MuiPaper-root': {
    borderRadius: '24px',
    margin: '10px',
  },
  '& .MuiDialog-container': {
    backdropFilter: 'blur(4px)',
    backgroundColor: 'hsl(0deg 0% 100% / 50%)',
  },
}));

const fetchCalculators = async (id: string) => {
  const customComboFilterModel = {
    type: 'COMBO',
    entity: 'QUESTIONS',
    mode: 'QUESTIONS_IN_FORM_BUILDER__ALL',
    input: '',
    page: 0,
    rows: 10000,
    extMap: {
      formId: id,
      typeRequest: 'QAC_BY_FILTER',
    },
  };
  const url = `/question/q-and-c-custom-combo?customComboFilterModel=${encodeURIComponent(JSON.stringify(customComboFilterModel))}`;
  const response = await AxiosApi.get(url);
  return response.data;
};

export const CreateCalculatorMobile = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ['calculators'],
    queryFn: () => fetchCalculators(id as string),
    staleTime: 0,
    gcTime: 600000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const handleClose = () => {
   
  };

  return (

      <>
        {isLoading && <p>Loading calculators...</p>}
        {error && <p>Error loading calculators: {(error as Error).message}</p>}
        {data && <AdvancedFormulaEditor questionList={data} handleClose={handleClose} />}

      </>
  );
};

export default CreateCalculatorMobile;
