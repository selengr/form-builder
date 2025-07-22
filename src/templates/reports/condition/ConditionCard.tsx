"use client";
// dnd
import {CSS} from "@dnd-kit/utilities";
import {useSortable} from "@dnd-kit/sortable";
import {useQueryClient} from '@tanstack/react-query';
//services
import {AxiosApi} from "@/services/axios/AxiosApi";
// React & Libs
import {SlPencil} from "react-icons/sl";
import {useCallback, useState} from "react";
import {Button, CircularProgress, Menu, Typography} from "@mui/material";
// types
import {IConditionCardProps} from "@/types/conditionReportSolo";
// components
import ConfirmDialog from "@/components/confirm-dialog";
import {EditConditionDialog} from "./EditConditionDialog";
import {ConditionCardOperator} from "./ConditionCardOperator";
// icons
import {IonCopyOutline} from "@/../public/images/icons/CopyIcon";
import {WeuiDeleteOutlined} from "../../../../public/images/icons/DeleteIcon";
import {useDeleteReport} from "@/app/reports/create-solo/[id]/_hooks/useDeleteReport";
import {PhDotsThreeVerticalBold} from "../../../../public/images/icons/PhDotsThreeVerticalBold";
import {toast} from "sonner";

const buttonStyles = {
  height: "50px",
  fontWeight: "400",
  fontSize: "15px",
  borderRadius: "10px",
  boxShadow: "none",
  transition: "background-color 0.3s, border-color 0.3s",
};

const buttonStylesError = {
  bgcolor: "#FA4D56",
  borderColor: "#FA4D56",
  "&:hover": {
    bgcolor: "#C6394D",
  },
  "&:active": {
    bgcolor: "#A32A3A",
  },
};

export function ConditionCard({
  condition,
  index,
}: IConditionCardProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [loadingDuplicateData, setLoadingDuplicateData] = useState(false);


  const queryClient = useQueryClient();

  const menuOpen = Boolean(anchorEl);
  const { id } = condition;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: condition.id });

  const { mutate: deleteCondition, isPending } = useDeleteReport();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = useCallback((event: any) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleDelete = () => {
    deleteCondition(id, {
      onSuccess: () => {
        setOpen(false);
        handleClose();
      },
    });
  };

  const toggleConfirm = () => {
    setOpen((prev) => !prev);
  };

  const handleDuplicate = async (e: any) => {
    e.stopPropagation();
    try {
      setLoadingDuplicateData(true);
      await AxiosApi.post(`/report/solo/main-list/${id}/duplicate`);
      queryClient.invalidateQueries(['Report_List'] as any);
      queryClient.refetchQueries(['Report_List'] as any);
    } catch (error) {
      toast.error("خطایی رخ داده است");
    } finally {
      setAnchorEl(null);
      setLoadingDuplicateData(false);
    }
  };


  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-lg flex transition-all ${isDragging ? "opacity-50 scale-105" : ""
        }`}
    >
      <div className="flex flex-col justify-start items-center gap-[10px] pl-[10px]">
        <div className="bg-white h-8 w-8 rounded-[10px] flex justify-center items-center">
          {index + 1}
        </div>
        <div className="bg-white h-8 w-8 rounded-[10px] flex justify-center items-center">
          <button onClick={handleClick}>
            <PhDotsThreeVerticalBold color="#1758BA" fontSize="1.5rem" />
          </button>
          {menuOpen && (
            <Menu
              sx={{
                "& .MuiPaper-root.MuiPaper-elevation": {
                  borderRadius: "15px",
                },
                "& .MuiPaper-root": {
                  touchAction: "none",
                  width: "125px",
                },
                "& .MuiLoadingButton-label": {
                  width: "100%",
                },
              }}
              id="basic-menu"
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <Button
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#222",
                  paddingX: "10px",
                }}
                fullWidth
                onClick={handleDuplicate}
                loading={loadingDuplicateData}
              >
                <Typography>تکثیر</Typography>
                <IonCopyOutline width={18} height={18} />
              </Button>
              <Button
                sx={{
                  paddingX: "10px",
                  height: "36px",
                  borderRadius: "10px",
                  width: "100%",
                  display: "flex",
                  flexDirection: "row-reverse",
                  justifyContent: "space-between",
                  color: "#1758BA",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenEditDialog(true);
                  handleClose();
                }}
              >
                <SlPencil size="1.18rem" />
                <Typography sx={{ fontSize: "12px", color: "black" }}>
                  ویرایش
                </Typography>
              </Button>
              <Button
                sx={{
                  paddingX: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#FA4D56",
                }}
                loading={isPending}
                onClick={toggleConfirm}
                fullWidth
                disabled={isPending}
              >
                <Typography sx={{ fontSize: "12px", color: "black" }}>
                  حذف
                </Typography>
                <WeuiDeleteOutlined fontSize="1.2rem" />
              </Button>
            </Menu>
          )}
        </div>
      </div>

      <div
        {...attributes}
        {...listeners}
        className={`rounded-lg p-[10px] flex justify-between w-full border-[1px] border-[#1758BA] bg-[#fff] cursor-grab transition-colors active:cursor-grabbing touch-none ${isDragging ? "border-[#CCC]" : "border-[#1758BA]"
          }`}
      >
        <div className="flex justify-center items-center gap-[10px]">
          <ConditionCardOperator condition={condition} />
        </div>
      </div>
      {openEditDialog && (
        <EditConditionDialog
          open={openEditDialog}
          setOpen={setOpenEditDialog}
          // conditionId={condition.id}
          condition={condition}
        />
      )}

      <ConfirmDialog
        content="آیا از عملیات حذف اطمینان دارید؟"
        open={open}
        title="حذف"
        loading={isPending}
        onClose={toggleConfirm}
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
                <CircularProgress
                  size={20}
                  color="inherit"
                  thickness={5}
                  style={{ marginLeft: 10 }}
                />
                در حال حذف…
              </>
            ) : (
              "حذف"
            )}
          </Button>
        }
      />
    </div>
  );
}
