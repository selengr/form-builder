import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import DialogContent from '@mui/material/DialogContent';

export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  direction: 'rtl',
  maxHeight: '75vh',
  scrollbarWidth: 'thin',
  maxWidth: '100%',
  overflowX: 'hidden',
  padding: theme.spacing(2),
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3, 4),
    paddingTop: theme.spacing(2.8),
    paddingBottom: theme.spacing(1.8),
  },
}));

export const StyledDialog = styled(Dialog)({
  overflow: 'hidden',
  scrollbarWidth: 'none',
  '& .MuiPaper-root': {
    borderRadius: '24px',
    margin: '10px',
    width: '100%',
    maxWidth: 'calc(100vw - 20px)',
  },
  '& .MuiDialog-container': {
    backdropFilter: 'blur(4px)',
    backgroundColor: 'hsl(0deg 0% 100% / 50%)',
  },
});
