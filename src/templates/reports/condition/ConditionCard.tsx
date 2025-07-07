"use client";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

import { SlPencil } from "react-icons/sl";
import { useCallback, useState } from "react";
import { IGetCondition } from "@/types/conditionReportSolo";
import { Button, Menu, Typography } from "@mui/material";
import { EditConditionDialog } from "./EditConditionDialog";
import { ConditionCardOperator } from "./ConditionCardOperator";
import { WeuiDeleteOutlined } from "../../../../public/images/icons/DeleteIcon";
import { PhDotsThreeVerticalBold } from "../../../../public/images/icons/PhDotsThreeVerticalBold";
import { useDeleteCondition } from "@/app/reports/create-solo/[id]/_hooks/useDeleteCondition";

export function ConditionCard({
  condition,
  index,
}: {
  condition: IGetCondition;
  index: number;
}) {
  const [openDialog, setOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: condition.id });

  const { mutate: deleteCondition, isPending } = useDeleteCondition();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = useCallback((event: any) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleDelete = (id: number) => {
    deleteCondition(Number(id));
    handleClose();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-lg flex transition-all ${
        isDragging ? "opacity-50 scale-105" : ""
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
          {open && (
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
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
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
                  setOpen(true);
                  handleClose();
                }}
              >
                <Typography>ویرایش</Typography>
                <SlPencil size="1.18rem" />
              </Button>
              <Button
                sx={{
                  paddingX: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#FA4D56",
                }}
                loading={isPending}
                onClick={async (e) => {
                  e.stopPropagation();
                  handleDelete(condition.id!);
                }}
                fullWidth
                disabled={isPending}
              >
                <Typography>حذف</Typography>
                <WeuiDeleteOutlined fontSize="1.32rem" />
              </Button>
            </Menu>
          )}
        </div>
      </div>

      <div
        {...attributes}
        {...listeners}
        className={`rounded-lg p-[10px] flex justify-between w-full border-[1px] border-[#1758BA] bg-[#fff] cursor-grab transition-colors active:cursor-grabbing touch-none ${
          isDragging ? "border-[#CCC]" : "border-[#1758BA]"
        }`}
      >
        <div className="flex justify-center items-center gap-[10px]">
          <ConditionCardOperator condition={condition} />
        </div>
      </div>
      {openDialog && (
        <EditConditionDialog
          // handleClose={handleClose}
          open={openDialog}
          setOpen={setOpen}
          // conditionId={condition.id}
          condition={condition}
        />
      )}
    </div>
  );
}
