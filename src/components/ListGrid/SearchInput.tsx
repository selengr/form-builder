/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";

export default function SearchInput() {
  const searchParams = useSearchParams();
  const search = searchParams.get("query");
  const [value, setValue] = useState(search || "");
  const pathname = usePathname();
  const { push } = useRouter();

  function handleSearch(term: any) {
    setValue(term);
  }

  function handleClick() {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set("query", value);
    } else {
      params.delete("query");
    }

    push(`${pathname}?${params.toString()}`);
  }

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <Paper
      component="form"
      sx={{
        boxShadow: "unset",
        border: "1px solid #C9C9C9 ",
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: "100%",
        borderRadius: "13px",
      }}
    >
      <InputBase
        style={{}}
        sx={{ ml: 1, flex: 1, textAlign: "end" }}
        placeholder="جستجو"
        inputProps={{ "aria-label": "جستجو" }}
        defaultValue={searchParams.get("query")?.toString()}
        onKeyDown={handleKeyDown}
        onChange={(e) => {
          e.preventDefault();
          handleSearch(e.target.value);
        }}
      />
      <IconButton
        type="button"
        sx={{ p: "8px" }}
        aria-label="search"
        onClick={handleClick}
      >
        <Image
          src="./images/home-page/search.svg"
          width={23}
          height={23}
          alt="Add"
          style={{
            cursor: "pointer",
          }}
        />
      </IconButton>
    </Paper>
  );
}
