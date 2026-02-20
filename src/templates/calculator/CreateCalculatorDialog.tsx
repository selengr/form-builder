'use client';

import { CgClose } from 'react-icons/cg';
import Dialog from '@mui/material/Dialog';
import { useParams } from 'next/navigation';
import { styled } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';
import { Container, IconButton } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';

import BuilderLoading from '@/app/(builder)/builder/[id]/loading';
import { ICreateCalculatorDialogProps } from '@/types/calculator';
import AdvancedFormulaEditor from '@/components/calculator/AdvancedFormulaEditor';
// action
import { fetchCalculatorsAction } from '../../../actions/calculator/calculator';

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

export const CreateCalculatorDialog: React.FC<ICreateCalculatorDialogProps> = ({ open, setOpen }) => {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ['calculators'],
    queryFn: () => fetchCalculatorsAction(id as string),
    staleTime: 0,
    gcTime: 600000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const handleClose = () => {
    setOpen((prev) => !prev);
  };

  return (
    <StyledDialog open={open} maxWidth='md'>
      <StyledDialogContent>
        <div className='flex items-center justify-end h-6'>
          <IconButton edge='end'>
            <CgClose color='#404040' width={25} height={20} size='1.5rem' onClick={() => handleClose()} />
          </IconButton>
        </div>
        {isLoading && <Container maxWidth='sm' sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minWidth: 576, height: 400 }}>
          <p>در حال بارگیری ماشین حساب...</p>
          <BuilderLoading  className='min-h-16'/>
        </Container>}
        {error && <p> خطا در بارگیری ماشین حساب.: {(error as Error).message}</p>}
        {data && <AdvancedFormulaEditor questionList={data} handleClose={handleClose} />}
      </StyledDialogContent>
    </StyledDialog>
  );
};

export default CreateCalculatorDialog;
