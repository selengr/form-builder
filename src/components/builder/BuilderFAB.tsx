'use client';

import { Fab } from '@mui/material';
import { HiPlus } from 'react-icons/hi';
import useActionOpenBottomSheet from '@/hooks/useActionOpenBottomSheet';
import useActionDesigner from '@/hooks/useActionDesigner';
import useDesigner from '@/hooks/useDesigner';

interface BuilderFABProps {
  disabled?: boolean;
  isQuestionnaireTab?: boolean;
}

export default function BuilderFAB({
  disabled = false,
  isQuestionnaireTab = true,
}: BuilderFABProps) {
  const setOpenBottomSheet = useActionOpenBottomSheet();
  const { setSelectedGroup } = useActionDesigner();
  const { questionGroups } = useDesigner();

  const handleClick = () => {
    if (disabled) return;

    if (isQuestionnaireTab) {
      if (!questionGroups.length) return;
      setSelectedGroup(questionGroups[questionGroups.length - 1]);
    }

    setOpenBottomSheet(true);
  };

  return (
    <Fab
      onClick={handleClick}
      disabled={disabled || (isQuestionnaireTab && !questionGroups.length)}
      aria-label="افزودن"
      sx={{
        display: { xs: 'flex', lg: 'none' },
        position: 'fixed',
        bottom: 88,
        right: 20,
        zIndex: 39,
        backgroundColor: '#2CDFC9',
        color: 'white',
        width: 56,
        height: 56,
        boxShadow: '0 4px 12px rgba(44, 223, 201, 0.4)',
        '&:hover': { backgroundColor: '#25c4b3' },
        '&.Mui-disabled': { backgroundColor: '#ccc', color: '#888' },
      }}
    >
      <HiPlus size={28} />
    </Fab>
  );
}
