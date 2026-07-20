'use client';

import Image from 'next/image';
import { useState } from 'react';
import {
  Button,
  CircularProgress,
  Menu,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { SlPencil } from 'react-icons/sl';

import { ICalculatorCardProps } from '@/types/calculator';
import ConfirmDialog from '@/components/confirm-dialog';
import EditCalculatorDialog from './EditCalculatorDialog';
import { WeuiDeleteOutlined } from '../../../public/images/icons/DeleteIcon';
import { PhDotsThreeVerticalBold } from '../../../public/images/icons/PhDotsThreeVerticalBold';
import {
  useCheckDependency,
  useDeleteCalculator,
} from '../../app/(builder)/builder/[id]/calculator/_hooks';

export const buttonStyles = {
  height: '45px',
  fontWeight: '400',
  fontSize: '15px',
  borderRadius: '12px',
  boxShadow: 'none',
  transition: 'background-color 0.3s, border-color 0.3s',
};

export const buttonStylesAlert = {
  bgcolor: '#1758BA',
  borderColor: '#1758BA',
  '&:hover': { bgcolor: '#0F4C8A' },
  '&:active': { bgcolor: '#0A3A6A' },
};

export const buttonStylesError = {
  bgcolor: '#FA4D56',
  borderColor: '#FA4D56',
  '&:hover': { bgcolor: '#C6394D' },
  '&:active': { bgcolor: '#A32A3A' },
};

export const buttonStylesSuccess = {
  bgcolor: '#2CDFC9',
  borderColor: '#2CDFC9',
  color: '#161616',
  '&:hover': { bgcolor: '#25B5A7' },
  '&:active': { bgcolor: '#1E9990' },
};

export function CalculatorCard({
  calculator,
  index: _index,
  disabled = false,
  onEdit,
  onDeleteSuccess,
}: ICalculatorCardProps) {
  const { id, name, label } = calculator;

  const { push } = useRouter();
  const { id: pageId } = useParams();
  const isDesktop = useMediaQuery('(min-width:768px)');

  const [openConfirm, setOpenConfirm] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [hasDependencies, setHasDependencies] = useState(false);

  const { mutate: deleteCalc, isPending } = useDeleteCalculator();
  const { mutate: checkDependency, isPending: depLoading } = useCheckDependency();

  const isMenuOpen = Boolean(anchorEl);
  const isDeleting = isPending || depLoading;
  const title = name?.trim() || label?.trim() || '—';

  const openMenu = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const closeMenu = () => setAnchorEl(null);

  const openEdit = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    closeMenu();

    if (onEdit) {
      onEdit(id);
      return;
    }

    if (isDesktop) setOpenEditDialog(true);
    else push(`/builder/${pageId}/calculator/create?calcId=${id}`);
  };

  const tryDelete = () => {
    checkDependency(
      { id },
      {
        onSuccess: ({ response }) => {
          response ? setHasDependencies(true) : performDelete();
        },
      },
    );
  };

  const performDelete = () => {
    deleteCalc(id, {
      onSuccess: () => {
        onDeleteSuccess?.();
      },
    });
    setOpenConfirm(false);
    closeMenu();
    setHasDependencies(false);
  };

  return (
    <>
      <div
        dir="rtl"
        className={`relative w-full min-h-[56px] rounded-xl border border-[#DDE1E6] bg-white px-2 py-2 flex items-center gap-3 pl-12 ${
          disabled ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        <button
          type="button"
          onClick={openMenu}
          disabled={disabled}
          className="absolute left-3 z-50 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-[10px] hover:bg-[#F7F7FF] transition-colors"
          aria-label="منو"
        >
          <PhDotsThreeVerticalBold color="#9EA3AC" fontSize="2rem" />
        </button>

  <div className="flex items-start justify-between pr-2 pl-3">
        <span className="bg-[#F7F7FF] rounded-[10px] h-9 w-9 flex justify-center items-center shrink-0">
          <Image src="/images/calc/ic_calculator.svg" width={22} height={22} alt="" />
        </span>
        </div>
        <p className="flex-1 min-w-0 text-[14px] font-medium text-[#161616] text-right leading-snug break-words">
          {title}
        </p>

      </div>

      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={closeMenu}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '15px',
            width: '125px',
            touchAction: 'none',
          },
        }}
      >
        <Button
          sx={{
            px: 2,
            height: 36,
            borderRadius: '10px',
            width: '100%',
            flexDirection: 'row-reverse',
            justifyContent: 'space-between',
            color: '#1758BA',
          }}
          onClick={openEdit}
          disabled={disabled}
        >
          <SlPencil size="1rem" />
          <Typography fontSize="12px" color="black">
            ویرایش
          </Typography>
        </Button>

        <Button
          sx={{ px: 2, justifyContent: 'space-between', color: '#FA4D56' }}
          fullWidth
          disabled={disabled || isPending}
          onClick={() => setOpenConfirm(true)}
        >
          <Typography fontSize="12px" color="black">
            حذف
          </Typography>
          <WeuiDeleteOutlined fontSize="1.2rem" />
        </Button>
      </Menu>

      {openEditDialog && (
        <EditCalculatorDialog
          open={openEditDialog}
          setOpen={setOpenEditDialog}
          calcId={id}
        />
      )}

      <ConfirmDialog
        content="آیا از عملیات حذف اطمینان دارید؟"
        open={openConfirm}
        title="حذف"
        loading={isDeleting}
        onClose={() => setOpenConfirm(false)}
        cancelText="انصراف"
        action={
          <Button
            fullWidth
            variant="contained"
            disabled={isDeleting}
            sx={{ ...buttonStyles, ...buttonStylesError }}
            onClick={tryDelete}
          >
            {isDeleting ? (
              <>
                <CircularProgress size={20} color="inherit" style={{ marginLeft: 10 }} />
                در حال حذف…
              </>
            ) : (
              'حذف'
            )}
          </Button>
        }
      />

      <ConfirmDialog
        content="این محاسبه‌گر در بخش‌های دیگر استفاده شده است. حذف آن باعث حذف خودکار وابستگی‌ها می‌شود."
        open={hasDependencies}
        title="هشدار"
        loading={isPending}
        onClose={() => setHasDependencies(false)}
        cancelText="لغو"
        action={
          <Button
            fullWidth
            variant="contained"
            disabled={isPending}
            sx={{ ...buttonStyles, ...buttonStylesError }}
            onClick={performDelete}
          >
            {isPending ? (
              <>
                <CircularProgress size={20} color="inherit" style={{ marginLeft: 10 }} />
                در حال حذف…
              </>
            ) : (
              'حذف'
            )}
          </Button>
        }
      />
    </>
  );
}
