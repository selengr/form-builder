'use client';

import { CgClose } from 'react-icons/cg';
import { useParams } from 'next/navigation';
import { styled } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { Container, IconButton } from '@mui/material';

import BuilderLoading from '@/app/(builder)/builder/[id]/loading';
import { ICreateCalculatorDialogProps } from '@/types/calculator';
import AdvancedFormulaEditor from '@/components/calculator/AdvancedFormulaEditor';

import { fetchCalculatorsAction } from '../../../actions/calculator/calculator';

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  direction: 'ltr',
  maxHeight: '75vh',
  maxWidth: '100%',
  scrollbarWidth: 'thin',
  padding: theme.spacing(3.8),
}));

const StyledDialog = styled(Dialog)({
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
});

const CreateCalculatorDialog: React.FC<ICreateCalculatorDialogProps> = ({ open, setOpen }) => {
  const { id } = useParams();

  const handleClose = () => setOpen(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['calculators', id],
    queryFn: () => fetchCalculatorsAction(id as string),
    enabled: open && !!id,
    gcTime: 10 * 60 * 1000,
  });

  return (
    <StyledDialog open={open} maxWidth="md" onClose={handleClose}>
      <StyledDialogContent>

        <div className="flex items-center justify-end h-6">
          <IconButton edge="end" onClick={handleClose} sx={{zIndex:2}}>
            <CgClose color="#404040" size="1.5rem" />
          </IconButton>
        </div>

        {isLoading && (
          <Container
            maxWidth="sm"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              minWidth: 576,
              height: 400,
            }}
          >
            <p>در حال بارگیری ماشین حساب...</p>
            <BuilderLoading className="min-h-16" />
          </Container>
        )}

        {error && <p>خطا در بارگیری ماشین حساب: {(error as Error).message}</p>}

        {data && (
          <AdvancedFormulaEditor
            questionList={data}
            handleClose={handleClose}
          />
        )}

      </StyledDialogContent>
    </StyledDialog>
  );
};

export default CreateCalculatorDialog;
