"use client";

import DataAutocomplete from "./DataAutocomplete";
import type {
  IDataAutocomplete,
  TAutocomplete,
} from "./types";

function Autocomplete<T>({ variant = "data", ...props }: TAutocomplete<T>) {
  switch (variant) {
    case "data":
      return <DataAutocomplete<T> {...(props as IDataAutocomplete<T>)} />;
    default:
      break;
  }
}

export default Autocomplete;
