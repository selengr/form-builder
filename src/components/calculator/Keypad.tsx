import React from 'react';
import { Box, Button, Select, MenuItem, Stack, Grid } from '@mui/material';
import Image from 'next/image';
import CalculatorParenthesis from '@/sections/calculator/calculator-parenthesis';
import CalculatorClear from '@/sections/calculator/calculator-clear';
// import CalculatorParenthesis from './CalculatorParenthesis';
// import CalculatorClear from './CalculatorClear';

interface KeypadProps {
  handleFnFX: () => void;
  handleNewField: () => void;
  handleParenthesis: (content: string) => void;
  handleOperator: (op: string) => void;
  handleNumber: (num: string) => void;
  handleUndo: () => void;
  contentEditable: React.RefObject<HTMLDivElement>;
}

const Keypad: React.FC<KeypadProps> = ({
  handleFnFX,
  handleNewField,
  handleParenthesis,
  handleOperator,
  handleNumber,
  handleUndo,
  contentEditable
}) => {
  const operators = ['+', '-', '*', '/'];
  const numbers = ['0', '.', '7', '8', '9', '4', '5', '6', '1', '2', '3'];

  return (
    <Box sx={{ width: { xs: "100%", sm: "30%" }, display: "flex", flexDirection: "column", justifyContent: "start", alignItems: "start", mt: 3 }} gap={"3px"}>
      <Select
        sx={{
          '& .MuiSelect-select': {
            padding: 1,
          },
          width: 145,
          height: 33,
          fontWeight: 500,
          marginBottom: "2px",
          backgroundColor: "#9D2CDF1A",
          borderRadius: '8px',
          color: "#9D2CDF",
          borderColor: "none",
          '&:before, &:after': {
            border: 'none',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '& .MuiSvgIcon-root': {
            color: "#9D2CDF",
          },
        }}
        displayEmpty
        defaultValue=""
        renderValue={(value: any) => (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Image
              alt="file preview"
              src={"/assets/icons/svg/ic_fx.svg"}
              height={30}
              width={30}
            />
            {value}
          </Box>
        )}
        MenuProps={{
          PaperProps: {
            sx: { px: 1, maxHeight: 280, minHeight: 180, mt: "3px" },
          },
        }}
        onClick={(e: any) => {
          if (e.target.tagName === "LI") {
            handleFnFX()
          } else {
            e.preventDefault()
          }
        }}
        onOpen={() => {
          contentEditable.current?.focus();
        }}
      >
        {["میانگین  ()"].map((option: any) => (
          <MenuItem
            key={option}
            value={option}
            sx={{
              py: 1,
              px: 2,
              height: 33,
              borderRadius: 1.75,
              typography: 'body2',
              backgroundColor: "#9D2CDF !important",
              color: "white",
              margin: "5px",
            }}
          >
            {option}
          </MenuItem>
        ))}
      </Select>

      <Button 
        sx={{
          border: '1px solid white',
          width: 145,
          height: 33,
          fontWeight: 500,
          color: "#1758BA", 
          backgroundColor: "#1758BA1A"
        }}
        onClick={handleNewField}
      >
        فیلد جدید
      </Button>

      <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        <Grid gridColumn={3} sx={{ width: "90%", display: "flex", flexDirection: "column", marginRight: "4px" }} >
          <CalculatorParenthesis operator={'('} handleParenthesis={handleParenthesis} />
          {operators.map((op, idx) => (
            <Button 
              key={idx}
              sx={{ 
                border: '1px solid white', 
                width: 33, 
                height: 33, 
                minWidth: 33, 
                color: "#1758BA", 
                backgroundColor: "#1758BA1A", 
                margin: "2px", 
                fontWeight: 500 
              }}
              onClick={() => handleOperator(op)}
            >
              {op}
            </Button>
          ))}
        </Grid>
        <Grid gridColumn={3} sx={{}} spacing={5} gap={5} rowGap={5} columnGap={6}>
          <CalculatorParenthesis operator={')'} handleParenthesis={handleParenthesis} />
          <CalculatorClear handleClear={handleUndo} />
          {numbers.reverse().map((num, idx) => (
            <Button 
              key={idx}
              sx={{
                border: '1px solid white', 
                width: num === "0" ? 70 : 33, 
                height: 33, 
                minWidth: num === "0" ? 70 : 33, 
                color: "#1758BA", 
                backgroundColor: "#1758BA1A", 
                margin: "2px",
                fontWeight: 500
              }}
              onClick={() => handleNumber(num)}
            >
              {num}
            </Button>
          ))}
        </Grid>
      </Stack>
    </Box>
  );
};

export default Keypad;

