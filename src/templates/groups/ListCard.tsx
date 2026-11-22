'use client';

import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { useCallback, useState } from 'react';
import { IconButton } from '@mui/material';
import { HiOutlineUserGroup } from 'react-icons/hi2';
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
      <div
        dir="rtl"
        className="flex items-center gap-2 min-h-[88px] w-full py-4 pl-3 pr-2 border border-[#E8E8E8] rounded-xl bg-white transition-shadow duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
        <span className="rounded-[10px] h-10 w-10 flex justify-center items-center shrink-0 bg-[#F7F7FF]">
          <HiOutlineUserGroup size={24} className="text-[#1758BA]" />
        </span>

        <div className="flex-1 min-w-0 flex flex-col gap-1.5 pr-1">
          <InfoRow
            label="نام"
            value={<span className="truncate block">{data.name}</span>}
            bold
            className="min-w-0"
          />
          <InfoRow label="تعداد اعضا" value={`${data.userCount} نفر`} bold />
        </div>

        <div className="flex items-center gap-1 shrink-0 pl-1 h-10">
          <Link href={`/groups/${data.id}?groupName=${encodeURIComponent(data.name)}`} className="flex h-10 w-10 items-center justify-center">
            <IconButton
              color="primary"
              aria-label="ویرایش گروه"
              sx={{ width: 40, height: 40, borderRadius: '10px', padding: 0 }}>
              <Image src={EditIcon} alt="edit" width={22} height={22} />
            </IconButton>
          </Link>
          <div className="flex h-10 items-center justify-center">
            <SwitchButton
              checked={!data.invalid}
              disabled={disabled}
              onChange={() => handleChangeStatus(Boolean(data.invalid))}
            />
          </div>
        </div>
      </div>

      {confirmOpen && (
        <InvalidConfirmDialog
          open={confirmOpen}
          onClose={handleCloseConfirm}
          onConfirm={(rememberAllocation) => handleChangeStatus(pendingActive, rememberAllocation)}
          loading={loading}
          title="اعضای این گروه"
        />
      )}
    </>
  );
}
