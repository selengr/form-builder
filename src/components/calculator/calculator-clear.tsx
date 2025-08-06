'use client';

import { Button } from '@mui/material';
import Image from 'next/image';

interface ICalculatorClear {
  handleClear: () => void;
}

const CalculatorClear = ({ handleClear }: ICalculatorClear) => {
  return (
    <>
      <Button
        sx={{
          border: '1px solid white',
          width: 64,
          minWidth: 64,
          height: 30,
          color: '#FA4D56',
          backgroundColor: '#FA4D561A',
          margin: '2px',
          '&.MuiButtonBase-root:hover': {
            backgroundColor: '#FA4D561A',
          },
          fontWeight: 500,
          borderRadius: '8px',
        }}
        onClick={handleClear}>
        <Image src={'/images/calc/arrow-left.svg'} width={25} height={25} alt='' />
      </Button>
    </>
  );
};

export default CalculatorClear;
