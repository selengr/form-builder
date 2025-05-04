import Image from "next/image";
import { LoadingButton } from "@mui/lab";
import { SlPencil } from "react-icons/sl";
import { useState } from "react";
import { Menu, Typography } from "@mui/material";
import { ICalculatorCardProps } from "@/types/calculator";
import EditCalculatorDialog from "./EditCalculatorDialog";
import { PhDotsThreeVerticalBold } from "../../../public/images/icons/PhDotsThreeVerticalBold";
import { WeuiDeleteOutlined } from "../../../public/images/icons/DeleteIcon";

export function CalculatorCard({ calculator, index, disabled = false }: ICalculatorCardProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenEditDialog = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setOpenDialog(true);
    handleCloseMenu();
  };

  return (
    <>
      <div
        className={`bg-white rounded-lg p-[10px] h-14 flex justify-between w-full border border-[#1758BA] ${
          disabled ? "opacity-50 pointer-events-none" : "cursor-pointer"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="bg-[#F7F7FF] h-8 w-8 rounded-[10px] flex justify-center items-center">
            {index + 1}
          </div>
          <div className="flex flex-col">
            <h3 className="text-[#161616] text-sm">{calculator.name ?? "--"}</h3>
            <span className="text-[#393939] text-xs">#محاسبه‌گر</span>
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
            <button onClick={handleOpenMenu} disabled={disabled}>
              <PhDotsThreeVerticalBold color="#1758BA" fontSize="1.5rem" />
            </button>

            <Menu
              anchorEl={anchorEl}
              open={isMenuOpen}
              onClose={handleCloseMenu}
              sx={{
                "& .MuiPaper-root": {
                  borderRadius: "15px",
                  width: "125px",
                  touchAction: "none",
                },
              }}
              MenuListProps={{
                "aria-labelledby": "calculator-menu-button",
              }}
            >
              <LoadingButton
                sx={{
                  px: 2,
                  height: 36,
                  borderRadius: "10px",
                  width: "100%",
                  flexDirection: "row-reverse",
                  justifyContent: "space-between",
                  color: "#1758BA",
                }}
                onClick={handleOpenEditDialog}
                disabled={disabled}
              >
                <Typography>ویرایش</Typography>
                <SlPencil size="1.18rem" />
              </LoadingButton>

              <LoadingButton
                sx={{
                  px: 2,
                  justifyContent: "space-between",
                  color: "#FA4D56",
                }}
                onClick={(e) => e.stopPropagation()}
                fullWidth
                disabled
              >
                <Typography>حذف</Typography>
                <WeuiDeleteOutlined fontSize="1.32rem" />
              </LoadingButton>
            </Menu>
          </div>
        </div>
      </div>

      {openDialog && (
        <EditCalculatorDialog
          open={openDialog}
          setOpen={setOpenDialog}
          calcId={calculator.id}
        />
      )}
    </>
  );
}
