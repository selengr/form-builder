'use client';
import { SyntheticEvent, useMemo, useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import GeneralSettings from '../GeneralSettings/GeneralSettings';
import IndividualSettings from '../IndividualSettings/IndividualSettings';
import MresalatUsersSettings from '../MresalatUsersSettings/MresalatUsersSettings';
import GroupSettings from '../GroupSettings/GroupSettings';

export type TabValues = 'general' | 'individual' | 'group' | 'mresalat';

interface CustomTabPanelProps {
  children?: React.ReactNode;
  index: TabValues;
  value: TabValues;
}

function CustomTabPanel(props: CustomTabPanelProps) {
  const { children, value, index } = props;
  const isSelected = value === index;

  const memoizedChildren = useMemo(() => {
    return isSelected ? children : null;
  }, [isSelected, children]);

  return (
    <div role='tabpanel' hidden={!isSelected} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`}>
      {memoizedChildren}
    </div>
  );
}

export default function PublishSettingsTabValue({ handleOpen, formId, formData }: { handleOpen: () => void; formId: string; formData: any }) {
  const [value, setValue] = useState<TabValues>('general');

  const handleChange = (_: SyntheticEvent, newValue: TabValues) => {
    setValue(newValue);
  };

  return (
    <>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Tabs
          TabIndicatorProps={{ style: { backgroundColor: '#2CDFC9' } }}
          value={value}
          onChange={handleChange}
          scrollButtons
          variant='scrollable'
          sx={{
            '&.MuiTabs-root': {
              width: '100%',
              paddingX: { md: '10px', lg: '40px' },
            },
            '& .MuiTabs-indicator': {
              height: '3px',
              borderRadius: '3px 3px 0 0',
            },
            '& .Mui-selected': {
              color: '#393939 !important',
              fontWeight: 700,
            },
            '& .MuiTabs-flexContainer': {
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            },
          }}>
          <Tab disableRipple label='عمومی' value='general' />
          <Tab disableRipple label='انفرادی' value='individual' />
          <Tab disableRipple label='گروهی' value='group' />
          <Tab disableRipple label='اعضای ام‌رسالت' value='mresalat' disabled />
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index='general'>
        <GeneralSettings handleOpen={handleOpen} formData={formData} formId={formId} />
      </CustomTabPanel>

      <CustomTabPanel value={value} index='individual'>
        <IndividualSettings handleOpen={handleOpen} formData={formData} formId={formId} />
      </CustomTabPanel>

      <CustomTabPanel value={value} index='group'>
        <GroupSettings handleOpen={handleOpen} formData={formData} formId={formId} />
      </CustomTabPanel>

      <CustomTabPanel value={value} index='mresalat'>
        <MresalatUsersSettings handleOpen={handleOpen} />
      </CustomTabPanel>
    </>
  );
}
