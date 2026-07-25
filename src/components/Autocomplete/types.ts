import { type ReactNode } from 'react';
import { type AutocompleteProps, type AutocompleteRenderInputParams } from '@mui/material/Autocomplete';

export interface IMuiAutocompleteProps<T> extends Omit<AutocompleteProps<T, boolean | undefined, boolean | undefined, boolean | undefined>, 'renderInput' | 'getOptionLabel'> {
  renderInput?: (params: AutocompleteRenderInputParams) => ReactNode;
  getOptionLabel: (option: T) => string | number;
}

export interface IDataAutocomplete<T> extends IMuiAutocompleteProps<T> {
  variant: 'data';
  options: Array<T>;
}

export interface IDynamicURL {
  baseUrl: string;
  entity: `${EntityEnum}`;
  mode?: `${ModeEnum}`;
  rows: number;
}

export type TAutocomplete<T> = IDataAutocomplete<T>;
