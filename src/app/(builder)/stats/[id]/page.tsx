"use client";

import { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Paper,
  Select,
  styled,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";
import { IoStatsChartOutline } from "react-icons/io5";
import { LuUserRoundPlus } from "react-icons/lu";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#f7f7f7",
    color: "black",
    textAlign: "center",
    border: "none",
    fontWeight: 700,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    fontWeight: 700,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#f7f7f7",
    border: "none",
  },
  "& td": {
    border: "none",
    textAlign: "center",
    fontWeight: 700,
  },
  "&:last-child td, &:last-child th": {
    border: "none",
  },
}));

function createData(
  id: number,
  fullName: string,
  q1: string,
  q2: string,
  q3: string,
  q4: string
) {
  return { id, fullName, q1, q2, q3, q4 };
}

const tableHead = [
  { id: 1, title: "ردیف" },
  { id: 2, title: "نام و نام خانوادگی" },
  { id: 3, title: "سوال 1" },
  { id: 4, title: "سوال 2" },
  { id: 5, title: "سوال 3" },
  { id: 6, title: "سوال 4" },
  { id: 7, title: "گزارش" },
];

const rows = [
  createData(1, "علی مرادی", "بلی", "خیر", "آزاد", "200.000"),
  createData(2, "امیر جعفری", "بلی", "خیر", "بیکار", "350.000"),
  createData(3, "میلاد خسروی", "خیر", "بلی", "معلم", "450.000.500"),
  createData(4, "عباس بوعذار", "خیر", "خیر", "کارمند", "87.000"),
];

export default function StatsPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  return (
    <Box bgcolor="#fff" width="100%" padding={2}>
      <Box
        marginBottom={4}
        width="100%"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
        sx={{
          backgroundColor: "#F7F7FF",
          padding: "10px",
        }}
        borderRadius="10px"
      >
        <Link href="/builder">
          <Button
            disableRipple
            sx={{
              "&.MuiButtonBase-root": {
                borderRadius: "10px",
                border: "1px solid transparent",
                paddingX: "5px",
                width: "30px",
              },
            }}
          >
            <IoIosArrowForward fontSize="1.5rem" color="#000" />
          </Button>
        </Link>
        <Box sx={{ display: "flex", alignItems: "baseline" }}>
          <Typography
            variant="subtitle1"
            component={"h3"}
            fontWeight={600}
            fontSize="20px"
            color="#424242"
          >
            تست شخصی برای مدرسه
          </Typography>
        </Box>
        <Box></Box>
      </Box>
      <Box sx={{ width: "100%", paddingX: 2, paddingBottom: 2 }}>
        <TableContainer
          component={Paper}
          sx={{
            width: "100%",
            "&.MuiPaper-root": {
              boxShadow: "none",
              borderRadius: "12px",
            },
          }}
        >
          <Table sx={{ minWidth: 700 }}>
            <TableHead
              sx={{
                borderBottom: "5px solid white",
              }}
            >
              <TableRow>
                {tableHead.map((item: any) => (
                  <StyledTableCell key={item.id}>{item.title}</StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell>{row.id}</StyledTableCell>
                  <StyledTableCell>{row.fullName}</StyledTableCell>
                  <StyledTableCell align="right">{row.q1}</StyledTableCell>
                  <StyledTableCell align="right">{row.q2}</StyledTableCell>
                  <StyledTableCell align="right">{row.q3}</StyledTableCell>
                  <StyledTableCell align="right">{row.q4}</StyledTableCell>
                  <StyledTableCell align="right">
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="flex-end"
                      gap={1}
                    >
                      <IconButton
                        sx={{
                          borderRadius: "8px",
                          bgcolor: row.id === 3 ? "#FA4D56" : "#2CDFC9",
                          "&:hover": {
                            bgcolor: row.id === 3 ? "#FA4D56" : "#2CDFC9",
                          },
                        }}
                      >
                        <LuUserRoundPlus color="#fff" />
                      </IconButton>
                      <IconButton
                        sx={{
                          borderRadius: "8px",
                          bgcolor: "#1758BA",
                          "&:hover": {
                            bgcolor: "#1758BA",
                          },
                        }}
                      >
                        <IoStatsChartOutline color="#fff" />
                      </IconButton>
                    </Box>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
          <Box
            sx={{
              bgcolor: "#f7f7f7",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              paddingX: 2,
              paddingY: 1,
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Box display="flex" gap={1} alignItems="center">
              <Typography>سطر قابل نمایش در هر صفحه:</Typography>
              <Select
                sx={{
                  "&.MuiInputBase-root": {
                    bgcolor: "white",
                    borderRadius: "12px",
                    height: "36px",
                  },
                }}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={"all"}>همه</MenuItem>
              </Select>
            </Box>
            <Box display="flex" gap={1} alignItems="center">
              <IconButton
                sx={{
                  bgcolor: "white",
                  border: "1px solid #1758BA",
                  borderRadius: "50%",
                }}
              >
                <MdKeyboardArrowRight size="1.5rem" color="#1758BA" />
              </IconButton>
              <Typography>صفحه 1 از 3</Typography>
              <IconButton
                sx={{
                  bgcolor: "white",
                  border: "1px solid #1758BA",
                  borderRadius: "50%",
                }}
              >
                <MdKeyboardArrowLeft size="1.5rem" color="#1758BA" />
              </IconButton>
            </Box>
            <Box display="flex" gap={1} alignItems="center">
              <Typography>30 نفر در لیست</Typography>
              <Box bgcolor="#1758BA" padding={1} borderRadius="12px">
                <LuUserRoundPlus size="1.5rem" color="white" />
              </Box>
            </Box>
          </Box>
        </TableContainer>
      </Box>
    </Box>
  );
}
