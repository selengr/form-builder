'use client';

import { FC, ReactNode } from 'react';
import Box from '@mui/material/Box';
import styled from '@mui/material/styles/styled';

const StyledBox = styled(Box)(({ theme }) => ({
  userSelect: 'none',
  display: 'flex',
  justifyContent: 'center',
  margin: '10px',
  [theme.breakpoints.up('md')]: {
    margin: theme.spacing(2.5),
  },
}));

const ContentBox = styled(Box)(({ theme }) => ({
  maxWidth: '1200px',
  width: '100%',
  direction: 'ltr',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  padding: '16px',
  borderRadius: '12px',
  paddingBottom: '16px',
  dir: 'rtl',
  backgroundColor: '#ffffff',
  border: '1px solid #e0e0e0',
  boxShadow: '0px 0px 15px -5px #bdbdbd',
}));

const ResponsiveContainer: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className='w-full'>
      <StyledBox>
        <ContentBox>
          <Box></Box>
          {/*{children}*/}
        </ContentBox>
      </StyledBox>
    </div>
  );
};

export default ResponsiveContainer;
