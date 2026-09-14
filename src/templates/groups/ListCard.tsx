'use client';

import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { Suspense, useCallback, useState } from 'react';
import { IconButton } from '@mui/material';
import EditIcon from '@/../public/images/home-page/edit-2.svg';
import { InfoRow } from '@/components/common/infoRow';
import { SwitchButton } from '@/components/Switch/SwitchButton';
import { UnifiedListGridCardProps } from '@/components/unified-list-grid';
import { InvalidConfirmDialog } from './invalidConfirmDialog';
import { changeGroupStatusAction } from '@actions/groups/group';
import { GroupListItem } from './types';

export default function ListCard({
  data,
  refreshGrid,
}: UnifiedListGridCardProps<GroupListItem>) {
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingActive, setPendingActive] = useState(false);

  const handleChangeStatus = useCallback(
    async (isActive: boolean, rememberAllocation?: boolean) => {
      setDisabled(true);

      if (rememberAllocation === undefined && isActive) {
        setPendingActive(isActive);
        setConfirmOpen(true);
        return;
      }

      setLoading(true);
      try {
        const res = await changeGroupStatusAction({
          groupId: data.id,
          invalid: !isActive,
          rememberAllocation: rememberAllocation ?? false,
        });

        if (!res.success) {
          throw new Error(res.message || 'انجام عملیات با خطا مواجه شد');
        }

        toast.success('عملیات با موفقیت انجام شد');
        setConfirmOpen(false);
        refreshGrid?.();
      } catch (error: unknown) {
        toast.error(error instanceof Error ? error.message : 'انجام عملیات با خطا مواجه شد');
      } finally {
        setLoading(false);
        setDisabled(false);
      }
    },
    [data.id, refreshGrid],
  );

  const handleCloseConfirm = () => {
    setDisabled(false);
    setConfirmOpen(false);
  };

  return (
    <>
      <div className="relative border border-gray-200 rounded-xl p-4 transition flex flex-col gap-[10px] w-full">
        <Suspense fallback={<div>در حال بارگذاری...</div>}>
          <InfoRow label="نام" value={data.name} bold />
          <InfoRow label="تعداد اعضا" value={`${data.userCount} نفر`} bold />
        </Suspense>

        <div className="flex w-full gap-2">
          <Link
            className="absolute top-[6px] left-16"
            href={`/groups/${data.id}?groupName=${encodeURIComponent(data.name)}`}>
            <IconButton color="primary">
              <Image src={EditIcon} alt="edit" width={24} height={24} />
            </IconButton>
          </Link>

          <SwitchButton
            sx={{ position: 'absolute', top: 15, right: 15 }}
            checked={!data.invalid}
            disabled={disabled}
            onChange={() => handleChangeStatus(Boolean(data.invalid))}
          />
        </div>
      </div>

      {confirmOpen && (
        <InvalidConfirmDialog
          open={confirmOpen}
          onClose={handleCloseConfirm}
          onConfirm={(rememberAllocation) =>
            handleChangeStatus(pendingActive, rememberAllocation)
          }
          loading={loading}
          title="اعضای این گروه"
        />
      )}
    </>
  );
}
