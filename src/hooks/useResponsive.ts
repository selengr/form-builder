import { type Breakpoint, useMediaQuery, useTheme } from '@mui/material';
import { TQuery, TReturnType, TValue } from './types';

function useResponsive(query: TQuery, start?: TValue, end?: TValue): TReturnType {
  const theme = useTheme();

  const mediaUp = useMediaQuery(theme.breakpoints.up(start as TValue));

  const mediaDown = useMediaQuery(theme.breakpoints.down(start as TValue));

  const mediaBetween = useMediaQuery(theme.breakpoints.between(start as TValue, end as TValue));

  const mediaOnly = useMediaQuery(theme.breakpoints.only(start as Breakpoint));

  if (query === 'up') {
    return mediaUp;
  }

  if (query === 'down') {
    return mediaDown;
  }

  if (query === 'between') {
    return mediaBetween;
  }

  return mediaOnly;
}

export { useResponsive };
