"use client";

import {useRouter} from "next/navigation";
import {formStatusPersian, formTypePersian} from "@/constants/formDictionaries";
import {InfoRow} from "@/components/common/infoRow";
import React, {useState} from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {CgDanger} from "react-icons/cg";

interface FormCardBaseProps {
  data: any;
  buttonText: string;
  buttonLink?: string | ((id: string) => string);
}

export default function FormCardBase({data, buttonText, buttonLink}: FormCardBaseProps) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [reportData, setReportData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedReportKey, setSelectedReportKey] = useState<string | null>(null);
  const [reportText, setReportText] = useState("");

  const handleClick = () => {
    if (!buttonLink) return;
    const href = typeof buttonLink === "function" ? buttonLink(data.id) : buttonLink;
    router.push(href);
  };

  const handleMenuOpen = async (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/report");
      if (!res.ok) throw new Error("Failed to fetch report options");

      const json = await res.json();
      const list = json.responseModelList;

      if (Array.isArray(list)) {
        setReportData(list);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: any) {
      setError(err.message || "خطا در دریافت داده");
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleReport = (key: string) => {
    handleMenuClose();
    setSelectedReportKey(key);
    setReportText("");
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedReportKey(null);
    setReportText("");
  };

  const handleDialogSubmit = () => {
    if (selectedReportKey && reportText.trim()) {
      console.log("📨 گزارش ثبت شد:", {
        key: selectedReportKey, text: reportText.trim(),
      });
    }
    handleDialogClose();
  };

  return (<div className="border p-4 rounded-[20px] border-[#DDE1E6] flex flex-col gap-3 w-full max-w-full relative">
      {/* آیکون گزارش */}
      <div className="absolute top-2 left-2 z-10">
        <IconButton onClick={handleMenuOpen} size="medium">
          <CgDanger/>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{vertical: "bottom", horizontal: "left"}}
          transformOrigin={{vertical: "top", horizontal: "left"}}
        >
          {loading ? (<MenuItem disabled>
              <CircularProgress size={20}/>
            </MenuItem>) : error ? (<MenuItem disabled
                                              className="text-red-500">{error}</MenuItem>) : Array.isArray(reportData) && reportData.length > 0 ? (reportData.map((item: any, i: number) => (
              <MenuItem key={i} onClick={() => handleReport(item.key)}>
                {item.key.split(".").pop()}
              </MenuItem>))) : (<MenuItem disabled>داده‌ای یافت نشد</MenuItem>)}
        </Menu>
      </div>

      {/* اطلاعات فرم */}
      <InfoRow label="نام:" value={data.name} bold/>
      <InfoRow label="نوع:" value={formTypePersian[data.type]} bold/>
      <InfoRow label="دسترسی:" value={data.accessType || "عمومی"} bold/>
      <InfoRow label="وضعیت:" value={formStatusPersian[data.status]} bold/>

      <div className="flex w-full gap-2">
        <button
          className="bg-[#1758BA] hover:bg-[#216ee1] transition-all duration-200 max-w-full sm:max-w-[200px] px-2 h-[42px] w-full text-[14px] rounded-lg text-white"
          onClick={handleClick}
        >
          {buttonText}
        </button>
      </div>

      <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth
              dir="rtl"
              maxWidth="xs"
              sx={{
                overflow: "hidden", scrollbarWidth: "none", "& .MuiPaper-root": {
                  margin: "10px", borderRadius: "20px",
                }, "& .MuiDialog-container": {
                  backdropFilter: "blur(4px)", backgroundColor: "hsl(0deg 0% 100% / 50%)",
                },
              }}>
        <DialogTitle sx={{pb: 2, fontWeight: "700", textAlign:"center"}}> توضیح گزارش </DialogTitle>
        <DialogContent>
          <TextField
            multiline
            fullWidth
            rows={4}
            autoFocus
            placeholder="توضیحات خود را وارد کنید..."
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
          />
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex", gap: 3, width: "100%", marginTop: 1, marginBottom: 2, paddingX: "30px",
          }}>

          <Button onClick={handleDialogSubmit} fullWidth variant="contained" disableElevation color="primary"
                  sx={{
                    marginX: "0 !important",
                    height: "52px",
                    fontWeight: "600",
                    fontSize: "15px",
                    borderRadius: "10px",
                    borderColor: "#1758BA",
                  }}
          >تایید</Button>

          <Button onClick={handleDialogClose} fullWidth color="inherit"
                  variant="outlined"
                  sx={{
                    marginX: "0 !important",
                    height: "52px",
                    fontWeight: "600",
                    fontSize: "15px",
                    borderRadius: "10px",
                    color: "#1758BA",
                    borderColor: "#1758BA",
                  }}>انصراف</Button>

        </DialogActions>
      </Dialog>
    </div>);
}