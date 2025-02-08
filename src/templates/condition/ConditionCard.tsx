import Image from "next/image";
import { LoadingButton } from "@mui/lab";
import { SlPencil } from "react-icons/sl";
import { useCallback, useState } from "react";
import { Menu, Typography } from "@mui/material";
import { ConditionalSystem } from "./ConditionalSystem";
import { PhDotsThreeVerticalBold } from "../../../public/images/icons/PhDotsThreeVerticalBold";
import { WeuiDeleteOutlined } from "../../../public/images/icons/DeleteIcon";
import { TConditionData } from "@/lib/conditionFormSchema";
import { idGenerator } from '../../lib/idGenerator';


export function ConditionCard({ condition } : { condition : TConditionData} ) {
  const [openDialog, setOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = useCallback((event: any) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return (
    <>
      <div
        className="bg-white rounded-lg p-[10px] h-14
flex justify-between w-full cursor-pointer border-[1px]
border-[#1758BA]"
      >
        <div className="flex justify-center items-center gap-[10px]">
        <div className="flex flex-col">
          {condition?.subConditions?.map((item)=>(
             <div key={item.id} className="flex flex-row ">
             <span className="text-[#161616] text-sm">{item.logicalOperator?.split("@")[1] ?? "اگر"}</span>
             <span className="text-[#1758BA] text-sm">{item.questionType.split("@")[1]}</span>
             <span className="text-[#161616] text-sm">{item.conditionType.split("@")[1]}</span>
             <span className="text-[#1758BA] text-sm">{item.value}</span>
            </div>
          ))}
           <span className="text-[#0dff15] text-sm"><span>در اینصورت برو به: </span> {condition.returnQuestionId.split("@")[1]}</span>
           <span className="text-[#161616] text-sm"><span>در غیر اینصورت برو به:</span> {condition.elseQuestionId.split("@")[1]}</span>
        </div>
        </div>
        <div className="flex justify-center items-center gap-[10px]">
          <button className="bg-[#F7F7FF] h-8 w-8 rounded-[10px] flex justify-center items-center">
            <Image
              src={"/images/calc/math.svg"}
              width={25}
              height={25}
              alt="math"
            />
          </button>
          <div
            className="bg-[#F7F7FF] h-8 w-8 rounded-[10px] flex
justify-center items-center"
          >
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
                <LoadingButton
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
                </LoadingButton>
                <LoadingButton
                  sx={{
                    paddingX: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                    color: "#FA4D56",
                  }}
                  onClick={async (e) => {
                    e.stopPropagation();
                  }}
                  fullWidth
                  disabled={true}
                >
                  <Typography>حذف</Typography>
                  <WeuiDeleteOutlined fontSize="1.32rem" />
                </LoadingButton>
              </Menu>
            )}
          </div>
        </div>
      </div>
      {openDialog && (
        <ConditionalSystem
          handleClose={handleClose}
          // open={openDialog}
          // setOpen={setOpen}
          // calcId={condition.id}
        />
      )}
    </>
  );
}
