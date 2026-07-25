'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { useParams } from 'next/navigation';
import { Button, IconButton } from '@mui/material';
import SettingsDialog from '../SettingsDialog/SettingsDialog';
import { CodiconEye } from '@/../public/images/home-page/EyeIcon';
import type { DesignerSidebarData } from './DesignerSidebar';

const APP_SIDEBAR_WIDTH_PX = 500;

interface BuilderMobileBottomBarProps {
  data: DesignerSidebarData;
  formTitle: string;
  formLimitation: string | null;
  startFromContinue: boolean | null;
  onChangeName: (name: string) => void;
  onChangeLimitation: (value: string | null) => void;
  onChangeStartFromContinue: (value: boolean | null) => void;
  onPublish: () => void;
  isPublishing: boolean;
  isPublishDisabled: boolean;
  publishLabel: string;
  isDataCollection: boolean;
}

export default function BuilderMobileBottomBar({
  data,
  formTitle,
  formLimitation,
  startFromContinue,
  onChangeName,
  onChangeLimitation,
  onChangeStartFromContinue,
  onPublish,
  isPublishing,
  isPublishDisabled,
  publishLabel,
  isDataCollection,
}: BuilderMobileBottomBarProps) {
  const { id } = useParams();

  if (isDataCollection) return null;

  return (
    <div
      className={clsx(
        'lg:hidden fixed bottom-0 left-0 z-50 bg-white border-t border-[#E8E8E8] px-4 py-3 flex items-center gap-2',
        'right-0 md:right-[var(--app-sidebar-width)]',
      )}
      style={{ ['--app-sidebar-width' as string]: `${APP_SIDEBAR_WIDTH_PX}px` }}
    >
      <Button
        onClick={onPublish}
        variant="contained"
        loading={isPublishing}
        disabled={isPublishDisabled}
        fullWidth
        sx={{
          backgroundColor: '#1758BA',
          fontWeight: 700,
          fontSize: 15,
          borderRadius: '10px',
          height: 48,
          boxShadow: 'none',
          flex: 1,
          '&:hover': { backgroundColor: '#134a9e' },
        }}
      >
        {publishLabel}
      </Button>

      {formTitle && (
        <SettingsDialog
          formName={formTitle}
          data={data}
          formLimitation={formLimitation}
          onChangeName={onChangeName}
          onChangeLimitation={onChangeLimitation}
          startFromContinue={startFromContinue}
          onChangeStartFromContinue={onChangeStartFromContinue}
        />
      )}

      <Link href={`/preview/${id}`}>
        <IconButton
          sx={{
            height: 48,
            width: 48,
            borderRadius: '10px',
            backgroundColor: '#F7F7FF',
            flexShrink: 0,
            border: 'none',
          }}
        >
          <CodiconEye color="#1758BA" />
        </IconButton>
      </Link>
    </div>
  );
}
