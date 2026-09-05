'use client';

import { CgClose } from 'react-icons/cg';
import { IconButton } from '@mui/material';
import { useParams } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';
// components
import DestroyTicketCard from './DestroyTicketCard';
// hooks
import { useGetTicketList } from './hooks/useGetTicketList';
// style
import { StyledDialog, StyledDialogContent } from './userReports.style';

export interface IProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DestroyTicketDialog: React.FC<IProps> = ({ open, setOpen }) => {
  const { id } = useParams();
  const { data, error, isLoading } = useGetTicketList(id as string | string[], open);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <StyledDialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <StyledDialogContent>
        <div className="relative flex items-center justify-center mb-5 min-h-8">
          <IconButton
            onClick={handleClose}
            aria-label="بستن"
            sx={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              p: 0.5,
            }}>
            <CgClose color="#404040" size="1.4rem" />
          </IconButton>
          <h2 className="text-[15px] sm:text-base font-bold text-[#404040]">وقایع</h2>
        </div>
        <DestroyTicketCard data={data} loading={isLoading} error={error} />
      </StyledDialogContent>
    </StyledDialog>
  );
};

export default DestroyTicketDialog;
