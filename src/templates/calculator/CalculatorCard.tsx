"use client";
// React & Libs
import Image from "next/image";
import { useState } from "react";
import { Button, Menu, Typography, CircularProgress } from "@mui/material";
// types
import { ICalculatorCardProps } from "@/types/calculator";
// components
import ConfirmDialog from "@/components/confirm-dialog";
import EditCalculatorDialog from "./EditCalculatorDialog";
// icons
import { SlPencil } from "react-icons/sl";
import { WeuiDeleteOutlined } from "../../../public/images/icons/DeleteIcon";
import { PhDotsThreeVerticalBold } from "../../../public/images/icons/PhDotsThreeVerticalBold";
// hooks
import {
  useDeleteCalculator,
  useCheckDependency,
} from "../../app/(builder)/builder/[id]/calculator/_hooks";

export function CalculatorCard({
  calculator,
  index,
  disabled = false,
}: ICalculatorCardProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [hasDependencies, setHasDependencies] = useState<boolean>(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { mutate, isPending } = useDeleteCalculator();
  const { mutate: checkDependency, isPending: checkDependencyLoading } =
    useCheckDependency();

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

  const handleDelete = (id: number) => {
    checkDependency(
      { id },
      {
        onSuccess: (data) => {
          if (data) {
            toggleDependencies();
          } else {
            mutate(Number(id));
          }
          setOpen(false);
          handleCloseMenu();
        },
      }
    );
  };

  const toggleConfirm = () => {
    setOpen((prev) => !prev);
  };

  const toggleDependencies = () => {
    setHasDependencies((prev) => !prev);
  };

  const isDeleteLoading = checkDependencyLoading || isPending;

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
            <h3 className="text-[#161616] text-sm">
              {calculator.name ?? "--"}
            </h3>
            <span className="text-[#393939] text-xs">#محاسبه‌گر</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            className="bg-[#F7F7FF] h-8 w-8 rounded-[10px] flex justify-center items-center"
            disabled={disabled}
          >
            <Image
              src="/images/calc/math.svg"
              width={25}
              height={25}
              alt="math"
            />
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
              <Button
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
                <SlPencil size="1rem" />
                <Typography sx={{ fontSize: "12px", color: "black" }}>
                  ویرایش
                </Typography>
              </Button>

              <Button
                sx={{
                  px: 2,
                  justifyContent: "space-between",
                  color: "#FA4D56",
                }}
                fullWidth
                loading={isPending}
                disabled={isPending || disabled}
                onClick={toggleConfirm}
              >
                <Typography sx={{ fontSize: "12px", color: "black" }}>
                  حذف
                </Typography>
                <WeuiDeleteOutlined fontSize="1.2rem" />
              </Button>
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

      <ConfirmDialog
        content="آیا از عملیات حذف اطمینان دارید؟"
        open={open}
        title="حذف"
        loading={isDeleteLoading}
        onClose={toggleConfirm}
        cancelText="انصراف"
        action={
          <Button
            type="submit"
            fullWidth
            disableRipple
            variant="contained"
            disabled={isDeleteLoading}
            sx={{
              height: "50px",
              fontWeight: "400",
              fontSize: "15px",
              borderRadius: "10px",
              borderColor: "#1758BA",
              boxShadow: "none",
              "&.MuiButtonBase-root:hover, &.MuiButtonBase-root:active": {
                bgcolor: "#1758BA",
                boxShadow: "none",
              },
            }}
            onClick={() => handleDelete(calculator.id as number)}
          >
            {isDeleteLoading ? (
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
              "تایید"
            )}
          </Button>
        }
      />
      <ConfirmDialog
        content="محاسبه گر در جاهای دیگر استفاده شده
ایا از حذف این محاسبه گر اطمینان دارید؟!"
        open={hasDependencies}
        title="هشدار"
        loading={isPending}
        onClose={toggleDependencies}
        cancelText="انصراف"
        action={
          <Button
            type="submit"
            fullWidth
            disableRipple
            variant="contained"
            disabled={isPending}
            sx={{
              height: "50px",
              fontWeight: "400",
              fontSize: "15px",
              borderRadius: "10px",
              borderColor: "#1758BA",
              boxShadow: "none",
              "&.MuiButtonBase-root:hover, &.MuiButtonBase-root:active": {
                bgcolor: "#1758BA",
                boxShadow: "none",
              },
            }}
            onClick={() => handleDelete(calculator.id as number)}
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
              "تایید"
            )}
          </Button>
        }
      />
    </>
  );
}
