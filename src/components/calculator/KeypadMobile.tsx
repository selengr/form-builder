'use client';
import React from 'react';
import Image from 'next/image';
import CalculatorClear from './calculator-clear';
import { Box, Button, Grid2, MenuItem, Select, Stack } from '@mui/material';
import CalculatorParenthesis from './calculator-parenthesis';

interface KeypadMobileProps {
  handleFnFX: () => void;
  handleNewField: () => void;
  handleParenthesis: (content: string) => void;
  handleOperator: (op: string) => void;
  handleNumber: (num: string) => void;
  handleUndo: () => void;
  contentEditable: React.RefObject<HTMLDivElement>;
}

const KeypadMobile: React.FC<KeypadMobileProps> = ({ handleFnFX, handleNewField, handleParenthesis, handleOperator, handleNumber, handleUndo, contentEditable }) => {
  const operators = ['+', '-', '*', '/'];
  const numbers = ['0', '.', '7', '8', '9', '4', '5', '6', '1', '2', '3'];

  return (
    <Box
      sx={{
        width: { xs: "100%", md: "26%" },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        alignItems: 'start',
        mt: 3,
      }}
      gap={'3px'}>
      <Select
        sx={{
          '& .MuiSelect-select': {
            padding: 1,
          },
          width: { xs: "100%", md: 135 },
          height: 30,
          fontWeight: 500,
          marginBottom: '2px',
          backgroundColor: '#9D2CDF1A',
          borderRadius: '8px',
          color: '#9D2CDF',
          borderColor: 'none',
          '&:before, &:after': {
            border: 'none',
            padding: 0,
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
            padding: 0,
          },
          '& .MuiSvgIcon-root': {
            color: '#9D2CDF',
          },
        }}
        displayEmpty
        defaultValue=''
        renderValue={(value: any) => (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Image alt='file preview' src={'/images/calc/ic_fx.svg'} height={30} width={30} />
            {value}
          </Box>
        )}
        MenuProps={{
          PaperProps: {
            sx: {
              px: 1,
              maxHeight: 280,
              minHeight: 180,
              mt: '3px',
              borderRadius: 2,
            },
          },
        }}
        onClick={(e: any) => {
          if (e.target.tagName === 'LI') {
            handleFnFX();
          } else {
            e.preventDefault();
          }
        }}
        onOpen={() => {
          contentEditable.current?.focus();
        }}>
        {['میانگین ()'].map((option: any) => (
          <MenuItem
            key={option}
            value={option}
            sx={{
              py: 1,
              px: 2,
              height: 30,
              borderRadius: 1.75,
              typography: 'body2',
              backgroundColor: '#9D2CDF !important',
              color: 'white',
              margin: '5px',
            }}>
            {option}
          </MenuItem>
        ))}
      </Select>

      <Stack
        sx={{
          width: "100%",
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <CalculatorParenthesis operator={'('} handleParenthesis={handleParenthesis} />
        <CalculatorParenthesis operator={')'} handleParenthesis={handleParenthesis} />

        <Button
          sx={{
            border: '1px solid white',
            width: "100%",
            height: 30,
            borderRadius: '8px',
            fontWeight: 600,
            color: '#1758BA',
            backgroundColor: '#1758BA1A',
          }}
          onClick={handleNewField}>
          فیلد جدید
        </Button>
      </Stack>

      <Stack
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Grid2
          gridColumn={3}
          sx={{
            width: '79%',
            display: 'flex',
            flexDirection: 'column',
            marginRight: '4px',
          }}>
          {/* <CalculatorParenthesis operator={'('} handleParenthesis={handleParenthesis} /> */}
          {operators.map((op, idx) => (
            <Button
              key={idx}
              sx={{
                border: '1px solid white',
                width: 30,
                height: 30,
                minWidth: 30,
                color: '#1758BA',
                backgroundColor: '#1758BA1A',
                margin: '2px',
                borderRadius: '8px',
                fontWeight: 600,
              }}
              onClick={() => handleOperator(op)}>
              {op}
            </Button>
          ))}
        </Grid2>
        <Grid2 gridColumn={3} spacing={5} gap={5} rowGap={5} columnGap={6}>
          {/* <CalculatorParenthesis operator={')'} handleParenthesis={handleParenthesis} /> */}
          <CalculatorClear handleClear={handleUndo} />
          {numbers.reverse().map((num, idx) => (
            <Button
              key={idx}
              sx={{
                border: '1px solid white',
                width: num === '0' ? 64 : 30,
                height: 30,
                minWidth: num === '0' ? 64 : 30,
                color: '#1758BA',
                backgroundColor: '#1758BA1A',
                margin: '2px',
                fontWeight: 600,
                borderRadius: '8px',
              }}
              onClick={() => handleNumber(num)}>
              {num}
            </Button>
          ))}
        </Grid2>
      </Stack>
    </Box>
  );
};

export default KeypadMobile;
