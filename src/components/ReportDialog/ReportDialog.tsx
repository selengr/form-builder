"use client";

import React, {useEffect, useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import {toast} from "sonner";
import {fetchUserInfo} from "@/lib/auth";

interface ReportDialogProps {
  open: boolean;
  onClose: () => void;
  formId: any;
}

export default function ReportDialog({open, onClose, formId}: ReportDialogProps) {
  const [reportData, setReportData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedReportKey, setSelectedReportKey] = useState<string | null>(null);
  const [reportText, setReportText] = useState("");

  useEffect(() => {
    if (open) {
      const fetchReportOptions = async () => {
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
      fetchReportOptions();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      setSelectedReportKey(null);
      setReportText("");
      setReportData([]);
      setError(null);
      setLoading(false);
    }
  }, [open]);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedReportKey(event.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedReportKey || !reportText.trim()) {
      toast.error("لطفاً دلیل گزارش و نوع گزارش را انتخاب کنید.");
      return;
    }

    const {userInfo} = await fetchUserInfo();
    const username = userInfo?.user?.username || "";

    try {
      const res = await fetch("/api/report", {
        method: "POST", headers: {
          "Content-Type": "application/json",
        }, body: JSON.stringify({
          formId: formId, description: reportText.trim(), username, responseForDestroyerReport: selectedReportKey,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.error);
      } else {
        await res.json();
        toast.success("گزارش با موفقیت ارسال شد");
        onClose();
      }
    } catch (error) {
      toast.error("خطا در ارسال گزارش");
    }
  };

  return (<Dialog open={open} onClose={onClose} fullWidth
                  dir="rtl"
                  maxWidth="xs"
                  sx={{
                    overflow: "hidden", scrollbarWidth: "none", "& .MuiPaper-root": {
                      margin: "10px", borderRadius: "20px",
                    }, "& .MuiDialog-container": {
                      backdropFilter: "blur(4px)", backgroundColor: "hsl(0deg 0% 100% / 50%)",
                    },
                  }}>
      <DialogTitle sx={{pb: 2, fontWeight: "700", textAlign: "center"}}> گزارش تخلف </DialogTitle>
      <DialogContent dividers>
        {loading ? (<div className="flex justify-center py-4">
            <CircularProgress size={24}/>
          </div>) : error ? (<div
            className="text-red-500 text-center py-4">{error}</div>) : Array.isArray(reportData) && reportData.length > 0 ? (
          <FormControl component="fieldset" fullWidth margin="normal">
            <FormLabel component="legend" sx={{mb: 1, fontWeight: "600", color: "inherit"}}>نوع گزارش:</FormLabel>
            <RadioGroup
              aria-label="report-reason"
              name="report-reason"
              value={selectedReportKey}
              onChange={handleRadioChange}
            >
              {reportData.map((item: any) => (<FormControlLabel
                  key={item.value}
                  value={item.value}
                  control={<Radio size="small"/>}
                  label={item.key.split(".").pop()}
                />))}
            </RadioGroup>
          </FormControl>) : (<div className="text-center py-4">داده‌ای برای گزارش یافت نشد.</div>)}

        <TextField
          multiline
          fullWidth
          rows={4}
          autoFocus
          margin="normal"
          label="توضیحات گزارش"
          placeholder="دلیل گزارش خود را بنویسید..."
          value={reportText}
          onChange={(e) => setReportText(e.target.value)}
          sx={{mt: 2}}
        />
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex", gap: 3, width: "100%", marginTop: 1, marginBottom: 2, paddingX: "30px",
        }}>

        <Button onClick={handleSubmit} fullWidth variant="contained" disableElevation color="primary"
                sx={{
                  marginX: "0 !important",
                  height: "52px",
                  fontWeight: "600",
                  fontSize: "15px",
                  borderRadius: "12px",
                  borderColor: "#1758BA",
                }}
        >تایید</Button>

        <Button onClick={onClose} fullWidth color="inherit"
                variant="outlined"
                sx={{
                  marginX: "0 !important",
                  height: "52px",
                  fontWeight: "600",
                  fontSize: "15px",
                  borderRadius: "12px",
                  color: "#1758BA",
                  borderColor: "#1758BA",
                }}>انصراف</Button>

      </DialogActions>
    </Dialog>);
}