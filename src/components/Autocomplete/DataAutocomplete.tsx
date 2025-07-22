"use client"

import {useState} from "react";
import {Autocomplete, AutocompleteRenderInputParams, Box, IconButton, Popper, Typography,} from "@mui/material";
import {IoIosArrowDown} from "react-icons/io";
import {type IDataAutocomplete} from "./types";
import Input from "./Input";

function DataAutocomplete<T>(props: IDataAutocomplete<T>) {
  const { getOptionLabel, ...rest } = props;
  const [open, setOpen] = useState(false);
  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      PopperComponent={(params) => (
        <Popper sx={{ direction: "rtl" }} {...params} />
      )}
      ListboxProps={{ sx: { "*": { direction: "ltr" } } }}
      renderInput={(params: AutocompleteRenderInputParams) => {
        const { InputLabelProps, InputProps, ...rest } = params;
        return (
          <Box position="relative" display="flex" alignItems="center">
            <IconButton
              sx={{
                position: "absolute",
                right: "0.2rem",
                transform: open ? "rotate(180deg)" : undefined,
              }}
            >
              <IoIosArrowDown size="1rem" />
            </IconButton>
            <Input ref={InputProps.ref} {...rest}/>
          </Box>
        );
      }}
      noOptionsText={
        <Typography fontSize="0.8rem" textAlign="center">
          نتیجه‌ای یافت نشد.
        </Typography>
      }
      getOptionLabel={(options) => getOptionLabel(options as T).toString()}
      {...rest}
    />
  );
}

export default DataAutocomplete;
