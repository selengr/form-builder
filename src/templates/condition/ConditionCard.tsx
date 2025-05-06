"use client";
import {SlPencil} from "react-icons/sl";
import {useCallback, useState} from "react";
import {IGetCondition} from "@/types/condition";
import {Button, Menu, Typography} from "@mui/material";
import {EditConditionDialog} from "./EditConditionDialog";
import {ConditionCardOperator} from './ConditionCardOperator';
import {WeuiDeleteOutlined} from "../../../public/images/icons/DeleteIcon";
import {PhDotsThreeVerticalBold} from "../../../public/images/icons/PhDotsThreeVerticalBold";
import {useDeleteCondition} from '@/app/(builder)/builder/[id]/condition/_hooks/useDeleteCondition';

export function ConditionCard({condition, index, disable = true,}: { condition: IGetCondition; index: number; disable?: boolean; }) {
  const [openDialog, setOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const {mutate: deleteCondition, isPending} = useDeleteCondition();

  const handleClick = useCallback((event: any) => {
    if (disable) return;
    setAnchorEl(event.currentTarget);
  }, [disable]);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleDelete = (id: number) => {
    deleteCondition(Number(id));
    handleClose();
  };

  return (<div
    className={`bg-[#F7F7FF] rounded-lg flex ${disable ? "opacity-50 pointer-events-none" : ""}`}
  >
    <div className="flex flex-col justify-start items-center gap-[10px] pl-[10px]">
      <div className="bg-white h-8 w-8 rounded-[10px] flex justify-center items-center">{index + 1}</div>
      <div className="bg-white h-8 w-8 rounded-[10px] flex justify-center items-center">
        <button onClick={handleClick} disabled={disable}>
          <PhDotsThreeVerticalBold color="#1758BA" fontSize="1.5rem"/>
        </button>
        {menuOpen && !disable && (<Menu
          sx={{
            "& .MuiPaper-root.MuiPaper-elevation": {
              borderRadius: "15px",
            }, "& .MuiPaper-root": {
              touchAction: "none", width: "125px",
            }, "& .MuiLoadingButton-label": {
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
            disabled={disable}
          >
            <Typography>ویرایش</Typography>
            <SlPencil size="1.18rem"/>
          </Button>

          <Button
            sx={{
              paddingX: "10px", display: "flex", justifyContent: "space-between", color: "#FA4D56",
            }}
            loading={isPending}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(condition.id!);
            }}
            fullWidth
            disabled={isPending || disable}
          >
            <Typography>حذف</Typography>
            <WeuiDeleteOutlined fontSize="1.32rem"/>
          </Button>
        </Menu>)}
      </div>
    </div>

    <div className="rounded-lg p-[10px] flex justify-between w-full cursor-pointer border-[1px] border-[#1758BA] bg-[#fff]">
      <div className="flex justify-center items-center gap-[10px]">
        <ConditionCardOperator condition={condition}/>
      </div>
    </div>

    {openDialog && (<EditConditionDialog
      open={openDialog}
      setOpen={setOpen}
      condition={condition}
    />)}
  </div>);
}
