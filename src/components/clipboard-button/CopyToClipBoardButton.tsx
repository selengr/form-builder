'use client';
import { Box } from '@mui/material';
import { ReactNode, useState } from 'react';
import Typography from '@mui/material/Typography';
import { GrCircleInformation } from 'react-icons/gr';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';

interface CopyToClipboardButtonProps {
  link: string;
  icon: ReactNode;
  label?: string;
  labelColor?: string;
}

const CopyToClipboardButton = ({ link, icon, label, labelColor }: CopyToClipboardButtonProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('کپی شد');

  const handleClick = () => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(link)
        .then(() => {
          setMessage('کپی شد');
          setIsError(false);
          setOpen(true);
        })
        .catch(() => {
          setMessage('کپی ناموفق بود');
          setIsError(true);
          setOpen(true);
        });
    } else {
      setMessage('مرورگر شما از این ویژگی پشتیبانی نمی کند');
      setIsError(true);
      setOpen(true);
    }
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <Box display='flex' justifyContent='center' alignItems='center' onClick={handleClick}>
        {icon}
        {label && (
          <Typography fontSize='13px' color={labelColor ?? '#6366f1'}>
            {label}
          </Typography>
        )}
      </Box>
      <Snackbar
        message={
          <div className='flex gap-2 items-center'>
            <GrCircleInformation strokeWidth={0.5} size='1.4rem' />
            <p>{message}</p>
          </div>
        }
        ContentProps={{
          style: {
            backgroundColor: isError ? '#dc2626' : '#323232',
            color: '#FFF',
          },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={2500}
        onClose={handleClose}
        open={open}
      />
    </>
  );
};

export default CopyToClipboardButton;
