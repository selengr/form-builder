  import { LoadingButton } from "@mui/lab";
  import { SlPencil } from "react-icons/sl";
  import { useCallback, useState } from "react";
  import { Menu, Typography } from "@mui/material";
  import { ConditionalSystem } from "./ConditionalSystem";
  import { TConditionData } from "@/lib/conditionFormSchema";
  import { ConditionCardOperator } from './ConditionCardOperator'; 
  import { WeuiDeleteOutlined } from "../../../public/images/icons/DeleteIcon";
  import { PhDotsThreeVerticalBold } from "../../../public/images/icons/PhDotsThreeVerticalBold";
  
  export function ConditionCard({ condition, index }: { condition: TConditionData, index : number }) {
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
      <div className="bg-[#F7F7FF] rounded-lg flex">
        <div className="flex flex-col justify-start items-center gap-[10px] pl-[10px]">
          <div className="bg-white h-8 w-8 rounded-[10px] flex justify-center items-center">{index+1}</div>
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
  
        <div className="rounded-lg p-[10px] flex justify-between w-full cursor-pointer border-[1px] border-[#1758BA] bg-[#fff]">
          <div className="flex justify-center items-center gap-[10px]">
            <ConditionCardOperator condition={condition} /> {/* Use the new component here */}
          </div>
        </div>
        {openDialog && (
          <ConditionalSystem
            handleClose={handleClose}
            open={openDialog}
            setOpen={setOpen}
            // conditionId={condition.id}
            condition
          />
        )}
      </div>
    );
  }
  







