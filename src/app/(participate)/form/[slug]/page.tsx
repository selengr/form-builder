"use client";

import { useState } from "react";
import { Button, IconButton, Menu, MenuItem, CircularProgress, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from "@mui/material";
import ResponsiveContainer from "@/templates/form/ContentWrapper";
import AnimatedBox from "@/templates/form/AnimatedBox";
import FormLimitation from "@/templates/form/FormLimitation";
import ActionButtons from "@/templates/form/ActionButtons";
import { useParticipateForm } from "@/hooks/useParticipateForm";
import Loading from "@/app/(builder)/preview/[id]/loading";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import finalStep from "@/../public/images/home-page/finalStep.svg";
import Image from "next/image";
import { CgDanger } from "react-icons/cg";
import { toast } from "sonner";
import { fetchUserInfo } from "@/lib/auth";

export default function ParticipateFormPage({ params }: { params: { slug: string } }) {
  const [limitationStepPassed, setLimitationStepPassed] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [reportData, setReportData] = useState<any[]>([]);
  const [loadingReportOptions, setLoadingReportOptions] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedReportKey, setSelectedReportKey] = useState<string | null>(null);
  const [reportText, setReportText] = useState("");

  const formId = params.slug;

  const {
    firstLoading,
    questionLoading,
    finishPage,
    limitation,
    question,
    formData,
    formName,
    ValidatedInput,
    handleValidationUpdate,
    handleNext,
    handlePrev,
    replace,
    setLimitation,
    setQuestion,
    initializeQuestion,
  } = useParticipateForm();

  const handleMenuOpen = async (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setLoadingReportOptions(true);
    setReportError(null);

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
      setReportError(err.message || "خطا در دریافت داده");
      setReportData([]);
    } finally {
      setLoadingReportOptions(false);
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

  const handleDialogSubmit = async () => {
    if (!selectedReportKey || !reportText.trim()) return;

    try {
      const { userInfo } = await fetchUserInfo();
      const username = userInfo?.user?.username || "";

      const res = await fetch("/api/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formId: formId,
          description: reportText.trim(),
          username,
          responseForDestroyerReport: selectedReportKey,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.error || "خطا در ارسال گزارش");
      } else {
        toast.success("گزارش با موفقیت ارسال شد");
      }
    } catch (error) {
      toast.error("خطا در ارسال گزارش");
    }

    handleDialogClose();
  };

  if (firstLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-white">
        <Loading />
      </div>
    );
  }

  if (limitation.isLimited && !limitationStepPassed) {
    return (
      <ResponsiveContainer>
        <FormLimitation
          type={limitation.limitationType}
          setLimitation={setLimitation}
          setQuestion={setQuestion}
          addQuestion={(data) => {
            initializeQuestion(data);
            setLimitationStepPassed(true);
          }}
        />
      </ResponsiveContainer>
    );
  }

  if (finishPage) {
    return (
      <div className="w-full flex flex-col p-4 overflow-hidden">
        <div className="flex flex-col bg-white rounded-xl h-full max-h-screen">
          <div className="flex items-center justify-center gap-4 bg-[#F7F7FF] rounded-lg px-4 py-3 mb-4 relative">
            <IconButton
              sx={{ position: "absolute", left: "8px" }}
              onClick={() => replace("/")}
            >
              <MdOutlineKeyboardArrowRight color="#292D32" />
            </IconButton>
            <p className="text-base font-bold text-[#161616] text-center">پایان</p>
          </div>

          <div className="flex-1 flex items-center justify-center overflow-y-auto px-4">
            <div className="w-full max-w-3xl">
              <AnimatedBox>
                <div className="w-full flex flex-col items-center justify-center gap-4 text-center">
                  <p className="text-lg font-semibold leading-relaxed">
                    پاسخ‌های شما به{" "}
                    <span className="text-xl font-bold">«{formName}»</span>{" "}
                    با موفقیت ثبت شد.
                  </p>

                  <div className="w-full max-w-xs sm:max-w-md">
                    <Image
                      src={finalStep}
                      alt="نتیجه"
                      width={300}
                      height={300}
                      priority
                      className="w-full h-auto max-h-[400px] object-contain"
                      draggable={false}
                    />
                  </div>

                  <Button
                    sx={{
                      width: "150px",
                      height: "52px",
                      borderRadius: "10px",
                      backgroundColor: "#1758BA",
                      boxShadow: "none",
                      "&:hover": {
                        backgroundColor: "#1758BA",
                        boxShadow: "none",
                      },
                    }}
                    variant="contained"
                    onClick={() => replace("/")}
                  >
                    بازگشت
                  </Button>
                </div>
              </AnimatedBox>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col p-4 overflow-hidden">
      <div className="flex flex-col bg-white rounded-xl h-full max-h-screen">
        <div className="flex items-center justify-center gap-4 bg-[#F7F7FF] rounded-lg px-4 py-4 mb-4 relative m-2" >
          <IconButton
            sx={{ position: "absolute", left: "8px" }}
            onClick={() => replace("/")}
          >
            <MdOutlineKeyboardArrowRight color="#292D32" />
          </IconButton>
          <p className="text-base font-bold text-[#161616] text-center mx-7">{formName}</p>

          <IconButton
            sx={{ position: "absolute", right: "8px" }}
            onClick={handleMenuOpen}
          >
            <CgDanger />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
          >
            {loadingReportOptions ? (
              <MenuItem disabled>
                <CircularProgress size={20} />
              </MenuItem>
            ) : reportError ? (
              <MenuItem disabled className="text-red-500">{reportError}</MenuItem>
            ) : Array.isArray(reportData) && reportData.length > 0 ? (
              reportData.map((item: any, i: number) => (
                <MenuItem key={i} onClick={() => handleReport(item.key)}>
                  {item.key.split(".").pop()}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>داده‌ای یافت نشد</MenuItem>
            )}
          </Menu>
        </div>

        <div className="flex-1 flex items-center justify-center overflow-y-auto px-4">
          <div className="w-full max-w-3xl">
            {question && (
              <AnimatedBox key={question.questionId}>
                <ValidatedInput
                  key={question.id}
                  formData={formData}
                  elementInstance={question}
                  onValidationUpdate={handleValidationUpdate}
                />
              </AnimatedBox>
            )}
          </div>
        </div>

        <div className="w-full flex justify-between items-center px-2 py-4">
          <ActionButtons
            loadingNext={questionLoading}
            disablePrev={questionLoading}
            nextAction={handleNext}
            prevAction={handlePrev}
          />
        </div>
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
        <DialogTitle sx={{ pb: 2, fontWeight: "700", textAlign: "center" }}> توضیح گزارش </DialogTitle>
        <DialogContent>
          <TextField
            multiline
            fullWidth
            rows={4}
            autoFocus
            placeholder="دلیل گزارش خود را بنویسد..."
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
                    borderRadius: "12px",
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
                    borderRadius: "12px",
                    color: "#1758BA",
                    borderColor: "#1758BA",
                  }}>انصراف</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}