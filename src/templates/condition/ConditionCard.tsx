'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Button, CircularProgress, Menu, Typography } from '@mui/material';
import { IConditionCardProps } from '@/types/condition';
import ConfirmDialog from '@/components/confirm-dialog';
import { EditConditionDialog } from './EditConditionDialog';
import { ConditionCardOperator } from './ConditionCardOperator';
import { SlPencil } from 'react-icons/sl';
import { WeuiDeleteOutlined } from '../../../public/images/icons/DeleteIcon';
import { PhDotsThreeVerticalBold } from '../../../public/images/icons/PhDotsThreeVerticalBold';
import { useDeleteCondition } from '@/app/(builder)/builder/[id]/condition/_hooks/useDeleteCondition';

const buttonStyles = {
  height: '45px',
  fontWeight: '400',
  fontSize: '15px',
  borderRadius: '12px',
  boxShadow: 'none',
  transition: 'background-color 0.3s, border-color 0.3s',
};

const buttonStylesError = {
  bgcolor: '#FA4D56',
  borderColor: '#FA4D56',
  '&:hover': { bgcolor: '#C6394D' },
  '&:active': { bgcolor: '#A32A3A' },
};

export function ConditionCard({
  qacWithOutFilterOptions,
  index,
  condition,
  disabled = true,
  onEdit,
  onDeleteSuccess,
}: IConditionCardProps) {
  const [open, setOpen] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { id } = condition;
  const menuOpen = Boolean(anchorEl);
  const persianNumber = (index + 1).toLocaleString('fa-IR');

  const { mutate: deleteCondition, isPending } = useDeleteCondition();

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => setAnchorEl(null);

  const handleDelete = () => {
    deleteCondition(id, {
      onSuccess: () => {
        onDeleteSuccess?.();
        setOpen(false);
        handleCloseMenu();
      },
    });
  };

  return (
    <>
      <div
        dir="rtl"
        className={`w-full flex relative flex-row rounded-xl border border-[#DDE1E6] bg-white p-2 ${
          disabled ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        <div className="flex items-start justify-between mb-3 pr-2 pl-6">
                 <span className="bg-[#F7F7FF] rounded-[10px] h-9 w-9 flex justify-center items-center shrink-0">
                  <Image src={"/images/calc/ic_condition.svg"} width={22} height={22} alt="" />
                </span>

          <button
            type="button"
            onClick={handleOpenMenu}
            disabled={disabled}
            className="flex z-50 items-center absolute left-3 justify-center w-9 h-9 rounded-[10px] hover:bg-[#F7F7FF] transition-colors"
            aria-label="منو"
          >
            <PhDotsThreeVerticalBold color="#9EA3AC" fontWeight="bold" fontSize="2rem" />
          </button>

    
     
        </div>

        <ConditionCardOperator
          qacWithOutFilterOptions={qacWithOutFilterOptions}
          condition={condition}
        />
      </div>

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleCloseMenu}
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
            display: 'flex',
            flexDirection: 'row-reverse',
            justifyContent: 'space-between',
            color: '#1758BA',
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (onEdit) onEdit();
            else setOpenEditDialog(true);
            handleCloseMenu();
          }}
          disabled={disabled}
        >
          <SlPencil size="1rem" />
          <Typography sx={{ fontSize: '12px', color: 'black' }}>ویرایش</Typography>
        </Button>

        <Button
          sx={{
            px: 2,
            display: 'flex',
            justifyContent: 'space-between',
            color: '#FA4D56',
          }}
          loading={isPending}
          disabled={isPending || disabled}
          onClick={() => setOpen(true)}
          fullWidth
        >
          <Typography sx={{ fontSize: '12px', color: 'black' }}>حذف</Typography>
          <WeuiDeleteOutlined fontSize="1.2rem" />
        </Button>
      </Menu>

      {openEditDialog && (
        <EditConditionDialog
          open={openEditDialog}
          setOpen={setOpenEditDialog}
          condition={condition}
        />
      )}

      <ConfirmDialog
        content="آیا از عملیات حذف اطمینان دارید؟"
        open={open}
        title="حذف"
        loading={isPending}
        onClose={() => setOpen((prev) => !prev)}
        cancelText="انصراف"
        action={
          <Button
            type="submit"
            fullWidth
            disableRipple
            variant="contained"
            disabled={isPending}
            sx={{ ...buttonStyles, ...buttonStylesError }}
            onClick={handleDelete}
          >
            {isPending ? (
              <>
                <CircularProgress size={20} color="inherit" thickness={5} style={{ marginLeft: 10 }} />
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
