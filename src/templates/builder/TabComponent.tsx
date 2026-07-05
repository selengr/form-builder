'use client';

import { Box, Tab, Tabs } from '@mui/material';

interface DesignerTabsProps {
  value: number;
  onChange: (value: number) => void;
  variant?: 'default' | 'sidebar' | 'mobile';
}

export default function DesignerTabs({
  value,
  onChange,
  variant = 'default',
}: DesignerTabsProps) {
  const isSidebar = variant === 'sidebar';
  const isMobile = variant === 'mobile';

  return (
    <Box width="100%">
      <Tabs
        value={value}
        onChange={(_, newValue) => onChange(newValue)}
        TabIndicatorProps={{
          style: { backgroundColor: isSidebar || isMobile ? '#1758BA' : '#2CDFC9' },
        }}
        sx={{
          '&.MuiTabs-root': {
            width: '100%',
            minHeight: isSidebar ? 40 : 48,
            px: isSidebar ? 0 : { md: '10px', lg: '40px' },
          },
          '& .MuiTabs-indicator': {
            height: '3px',
            borderRadius: '3px 3px 0 0',
            transition: 'all 0.2s ease-in-out',
          },
          '& .MuiTab-root': {
            fontSize: isSidebar ? '12px' : '13px',
            minHeight: isSidebar ? 40 : 48,
            color: '#9EA3AC',
            fontWeight: 400,
             paddingBottom: 1,
             width: "40%"
          },
          '& .Mui-selected': {
            color: isSidebar || isMobile ? '#1758BA !important' : '#393939 !important',
            fontWeight: 400,
          },
          '& .MuiTabs-flexContainer': {
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          },
        }}
      >
        <Tab label="منطق" disableRipple sx={{paddingBottem: 0}} />
        <Tab label="پرسشنامه" disableRipple />
      </Tabs>
    </Box>
  );
}

export { DesignerTabs as DesignerTabsNew };
