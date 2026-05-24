'use client';
// React & Libs
import { useState } from 'react';
import { Button, CircularProgress, Menu, Typography } from '@mui/material';
// types
import { IConditionCardProps } from '@/types/condition';
// components
import ConfirmDialog from '@/components/confirm-dialog';
import { EditConditionDialog } from './EditConditionDialog';
import { ConditionCardOperator } from './ConditionCardOperator';
// icons
import { SlPencil } from 'react-icons/sl';
import { WeuiDeleteOutlined } from '../../../public/images/icons/DeleteIcon';
import { PhDotsThreeVerticalBold } from '../../../public/images/icons/PhDotsThreeVerticalBold';
import { useDeleteCondition } from '@/app/(builder)/builder/[id]/condition/_hooks/useDeleteCondition';

const buttonStyles = {
  height: '50px',
  fontWeight: '400',
  fontSize: '15px',
  borderRadius: '10px',
  boxShadow: 'none',
  transition: 'background-color 0.3s, border-color 0.3s',
};

const buttonStylesError = {
  bgcolor: '#FA4D56',
  borderColor: '#FA4D56',
  '&:hover': {
    bgcolor: '#C6394D',
  },
  '&:active': {
    bgcolor: '#A32A3A',
  },
};

export function ConditionCard({ qacWithOutFilterOptions, index, condition, disabled = true }: IConditionCardProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { id } = condition;
  const menuOpen = Boolean(anchorEl);

  const { mutate: deleteCondition, isPending } = useDeleteCondition();

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    deleteCondition(id, {
      onSuccess: () => {
        setOpen(false);
        handleCloseMenu();
      },
    });
  };

  const toggleConfirm = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div className={`bg-[#F7F7FF] rounded-lg flex ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className='flex flex-col justify-start items-center gap-[10px] pl-[10px]'>
        <div className='bg-white h-8 w-8 rounded-[10px] flex justify-center items-center'>{index + 1}</div>
        <div className='bg-white h-8 w-8 rounded-[10px] flex justify-center items-center'>
          <button onClick={handleOpenMenu} disabled={disabled}>
            <PhDotsThreeVerticalBold color='#1758BA' fontSize='1.5rem' />
          </button>
          {menuOpen && !disabled && (
            <Menu
              sx={{
                '& .MuiPaper-root.MuiPaper-elevation': {
                  borderRadius: '15px',
                },
                '& .MuiPaper-root': {
                  touchAction: 'none',
                  width: '125px',
                },
                '& .MuiLoadingButton-label': {
                  width: '100%',
                },
              }}
              id='basic-menu'
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleCloseMenu}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}>
              <Button
                sx={{
                  paddingX: '10px',
                  height: '36px',
                  borderRadius: '10px',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row-reverse',
                  justifyContent: 'space-between',
                  color: '#1758BA',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenEditDialog(true);
                  handleCloseMenu();
                }}
                disabled={disabled}>
                <SlPencil size='1rem' />
                <Typography sx={{ fontSize: '12px', color: 'black' }}>ویرایش</Typography>
              </Button>

              <Button
                sx={{
                  paddingX: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: '#FA4D56',
                }}
                loading={isPending}
                disabled={isPending || disabled}
                onClick={toggleConfirm}
                fullWidth>
                <Typography sx={{ fontSize: '12px', color: 'black' }}>حذف</Typography>
                <WeuiDeleteOutlined fontSize='1.2rem' />
              </Button>
            </Menu>
          )}
        </div>
      </div>

      <div className='rounded-lg py-0 md:py-2 p-[10px] flex justify-between w-full cursor-pointer border-[1px] border-[#1758BA] bg-[#fff]'>
        <div className='flex justify-center items-center gap-1 md:gap-[10px]'>
          <ConditionCardOperator qacWithOutFilterOptions={qacWithOutFilterOptions} condition={condition} />
        </div>
      </div>

      {openEditDialog && <EditConditionDialog open={openEditDialog} setOpen={setOpenEditDialog} condition={condition} />}

      <ConfirmDialog
        content='آیا از عملیات حذف اطمینان دارید؟'
        open={open}
        title='حذف'
        loading={isPending}
        onClose={toggleConfirm}
        cancelText='انصراف'
        action={
          <Button type='submit' fullWidth disableRipple variant='contained' disabled={isPending} sx={{ ...buttonStyles, ...buttonStylesError }} onClick={handleDelete}>
            {isPending ? (
              <>
                <CircularProgress size={20} color='inherit' thickness={5} style={{ marginLeft: 10 }} />
                در حال حذف…
              </>
            ) : (
              'حذف'
            )}
          </Button>
        }
      />
    </div>
  );
}
