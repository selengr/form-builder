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
          variant="fullWidth"
          scrollButtons={false}
          sx={{
            width: '100%',
            px: { xs: 1, sm: 2, md: '10px', lg: '40px' },
            minHeight: { xs: 40, sm: 44, md: 48 },

            '& .MuiTabs-indicator': {
              height: { xs: 2, sm: 3 },
              borderRadius: '3px 3px 0 0',
            },

            '& .MuiTabs-flexContainer': {
              justifyContent: 'space-between',
            },

            '& .Mui-selected': {
              color: '#393939 !important',
              fontWeight: 700,
            },

            '& .MuiTab-root': {
              flex: 1,
              minWidth: 0,
              px: { xs: 0.5, sm: 1, md: 2 },
              py: { xs: 0.75, sm: 1, md: 1 },
              minHeight: { xs: 40, sm: 44, md: 48 },

              fontSize: { xs: '12px', sm: '13px', md: '14px' },
              fontWeight: { xs: 600, md: 700 },
              lineHeight: 1.15,

              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            },
          }}
        >
          <Tab disableRipple label="عمومی" value="general" />
          <Tab disableRipple label="انفرادی" value="individual" />
          <Tab disableRipple label="گروهی" value="group" />
          <Tab disableRipple label="اعضای ام‌رسالت" value="mresalat" disabled />
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
