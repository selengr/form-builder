import type { Breakpoint } from '@mui/material';

type TReturnType = boolean;

type TQuery = 'up' | 'down' | 'between' | 'only';

type TValue = Breakpoint | number;

export type { TValue, TQuery, TReturnType };
