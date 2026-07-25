import type { FC, PropsWithChildren } from 'react';
import { ThemeProvider } from '@mui/material';
import { theme } from '@/theme/theme';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';

type TMuiThemeProvider = PropsWithChildren;

const MuiThemeProvider: FC<TMuiThemeProvider> = ({ children }) => {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
};

export { MuiThemeProvider };
