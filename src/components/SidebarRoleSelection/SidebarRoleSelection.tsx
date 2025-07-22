"use client";

import {useState} from "react";
import {FormControl, MenuItem, Select, SelectChangeEvent,} from "@mui/material";
import Image from "next/image";
import {IoIosArrowDown} from "react-icons/io";
import UserIcon from "@/../public/images/home-page/user-octagon.svg";

const roles = [{ id: 1, value: "manager", label: "مدیر" }];

export default function SidebarRoleSelection() {
  const [role, setRole] = useState("manager");

  const handleChange = (event: SelectChangeEvent) => {
    setRole(event.target.value as string);
  };

  return (
    <FormControl fullWidth>
      <Select
        IconComponent={IoIosArrowDown}
        sx={{
          "& .MuiSelect-select.MuiSelect-outlined": {
            fontFamily: "inherit",
            paddingRight: "33px",
            paddingLeft: "0 !important",
          },
          "&.MuiInputBase-root": {
            borderRadius: "20px",
            height: "72px",
            bgcolor: "#F2F4F8",
            paddingX: "12px",
            paddingY: "20px",
          },
          "& .MuiSelect-icon": {
            left: "auto",
            right: "15px",
            top: "28px",
            fontSize: "1.3rem",
            color: "#292D32",
          },
          "& .MuiSelect-select": {
            display: "flex",
            justifyContent: "space-between",
            padding: "0",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
        }}
        value={role}
        labelId="roles"
        onChange={handleChange}
      >
        {roles.map((role: any) => {
          return (
            <MenuItem
              key={role.id}
              value={role.value}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "5px",
                width: "100%",
                gap: "16px",
              }}
            >
              <div className="flex justify-between items-center gap-1">
                <Image src={UserIcon} alt="" width={32} height={32} />
                <p className="text-black text-[14px] font-bold">شرکت فرداپ</p>
              </div>
              <div className="flex justify-between items-center gap-2">
                <p className="text-[#00A692] bg-[#96FAEE] text-[9px] font-bold py-0 h-[22px] flex items-center px-5 rounded-[10px]">
                  مدیر
                </p>
              </div>
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
