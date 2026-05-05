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

import { ICalculatorCardProps } from '@/types/calculator';
import ConfirmDialog from '@/components/confirm-dialog';
import EditCalculatorDialog from './EditCalculatorDialog';

import { SlPencil } from 'react-icons/sl';
import { WeuiDeleteOutlined } from '../../../public/images/icons/DeleteIcon';
import { PhDotsThreeVerticalBold } from '../../../public/images/icons/PhDotsThreeVerticalBold';

import {
  useCheckDependency,
  useDeleteCalculator,
} from '../../app/(builder)/builder/[id]/calculator/_hooks';

import { useParams, useRouter } from 'next/navigation';

/* --------------------------------- Styles --------------------------------- */

export const buttonStyles = {
  height: '50px',
  fontWeight: '400',
  fontSize: '15px',
  borderRadius: '10px',
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

/* -------------------------------- Component -------------------------------- */

export function CalculatorCard({
  calculator,
  index,
  disabled = false,
}: ICalculatorCardProps) {
  const { id } = calculator;

  const { push } = useRouter();
  const { id: pageId } = useParams();
  const isDesktop = useMediaQuery('(min-width:768px)');

  const [openConfirm, setOpenConfirm] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [hasDependencies, setHasDependencies] = useState(false);

  const { mutate: deleteCalc, isPending } = useDeleteCalculator();
  const {
    mutate: checkDependency,
    isPending: depLoading,
  } = useCheckDependency();

  const isMenuOpen = Boolean(anchorEl);
  const isDeleting = isPending || depLoading;

  /* ------------------------------ Event Handlers ------------------------------ */

  const openMenu = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const closeMenu = () => setAnchorEl(null);

  const openEdit = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    closeMenu();

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
    deleteCalc(id);
    setOpenConfirm(false);
    closeMenu();
    setHasDependencies(false);
  };

  /* ---------------------------------- Render ---------------------------------- */

  return (
    <>
      <div
        className={`bg-white rounded-lg p-[10px] min-h-14 flex justify-between w-full border border-[#1758BA]
        ${disabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
      >
        <div className="flex items-center gap-2.5">
          <div className="bg-[#F7F7FF] h-8 w-8 min-w-8 rounded-[10px] flex justify-center items-center">
            {index + 1}
          </div>

          <div className="flex flex-col">
            <h3 className="text-[#161616] text-sm break-words">{calculator.name ?? '--'}</h3>
            <span className="text-[#393939] text-xs">
              #محاسبه‌گر
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            className="bg-[#F7F7FF] h-8 w-8 rounded-[10px] flex justify-center items-center"
            disabled={disabled}
          >
            <Image src="/images/calc/math.svg" width={25} height={25} alt="math" />
          </button>

          <div className="bg-[#F7F7FF] h-8 w-8 rounded-[10px] flex justify-center items-center">
            <button onClick={openMenu} disabled={disabled}>
              <PhDotsThreeVerticalBold color="#1758BA" fontSize="1.5rem" />
            </button>
          </div>
        </div>
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
            sx={{ ...buttonStyles, ...buttonStylesAlert }}
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
