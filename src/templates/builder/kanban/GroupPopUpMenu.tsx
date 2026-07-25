'use client';

import { Fragment, memo, MouseEvent, useCallback, useState } from 'react';
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography';
import { WeuiDeleteOutlined } from '@/../public/images/icons/DeleteIcon';
import { PhDotsThreeVerticalBold } from '@/../public/images/icons/PhDotsThreeVerticalBold';
import useDesigner from '@/hooks/useDesigner';
import { PiWarningOctagonFill } from 'react-icons/pi';
import useActionDesigner from '@/hooks/useActionDesigner';
import ConfirmDialog from '@/components/confirm-dialog';
import { toast } from 'sonner';
import { AxiosApi } from '@/services/axios/AxiosApi';
import { Button } from '@mui/material';

const GroupPopUpMenu = memo(function GroupPopUpMenu({ groupId }: { groupId: number }) {
  const { deleteQuestionGroup } = useActionDesigner();
  const { questionGroups } = useDesigner();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [loadingDeleteData, setLoadingDeleteData] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const handleClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return (
    <Fragment>
      <button onClick={handleClick}>
        <PhDotsThreeVerticalBold color='#1758BA' fontSize='1.5rem' />
      </button>
      {open && (
        <Menu
          sx={{
            '& .MuiPaper-root.MuiPaper-elevation': {
              borderRadius: '15px',
            },
            '& .MuiPaper-root': {
              touchAction: 'none',
              width: '125px',
            },
          }}
          id='basic-menu'
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}>
          <Button
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              color: '#FA4D56',
              '& .MuiLoadingButton-label': {
                width: '100%',
              },
            }}
            onClick={async (e) => {
              e.stopPropagation();
              handleClose();
              setOpenConfirmDialog(true);
            }}
            fullWidth
            disabled={questionGroups.length === 1}>
            <Typography>حذف گروه</Typography>
            <WeuiDeleteOutlined width={20} height={20} />
          </Button>
        </Menu>
      )}
      {openConfirmDialog && (
        <ConfirmDialog
          content={
            <Fragment>
              <Typography fontWeight='700'>آیا از عملیات حذف گروه سوال اطمینان دارید؟</Typography>
              <Typography
                sx={{
                  marginTop: '15px',
                  fontSize: '14px',
                  textAlign: 'justify',
                  fontWeight: '700',
                }}>
                <PiWarningOctagonFill size='1.35rem' color='#ffc107' className='inline-block ml-1' />
                در صورت زدن دکمه تایید، گروه سوال به همراه تمام سوالات آن حذف می‌شوند
              </Typography>
            </Fragment>
          }
          open={openConfirmDialog}
          title='حذف گروه سوال'
          loading={loadingDeleteData}
          onClose={() => setOpenConfirmDialog(false)}
          cancelText='انصراف'
          action={
            <Button
              type='submit'
              fullWidth
              disableRipple
              variant='contained'
              loading={loadingDeleteData}
              sx={{
                height: '50px',
                fontWeight: '400',
                fontSize: '15px',
                borderRadius: '10px',
                borderColor: '#1758BA',
                boxShadow: 'none',
                '&.MuiButtonBase-root:hover, &.MuiButtonBase-root:active': {
                  bgcolor: '#1758BA',
                  boxShadow: 'none',
                },
              }}
              onClick={async () => {
                try {
                  setLoadingDeleteData(true);
                  const res: any = await AxiosApi.delete(`/question-group/${groupId}`);
                  if (res.data) {
                    toast.success('گروه سوال با موفقیت حذف شد');
                    deleteQuestionGroup(groupId);
                  } else {
                    toast.error('ناموفق بود مجددا امتحان نمایید');
                  }
                } catch (error) {
                  console.log(error);
                } finally {
                  setAnchorEl(null);
                  setLoadingDeleteData(false);
                }
              }}>
              تایید
            </Button>
          }
        />
      )}
    </Fragment>
  );
});

export default GroupPopUpMenu;
