"use client";

import React, { useCallback, useState } from "react";
import AxiosApi from "@/services/axios/AxiosApi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import { toast } from "sonner";
import { AiOutlinePieChart } from "react-icons/ai";
import { SwitchButton } from "@/components/Switch/SwitchButton";
import ConfirmDialog from "../confirm-dialog";
import PublishSettingsDialog from "../PublishSettingsDialog/PublishSettingsDialog";
import EditIcon from "@/../public/images/home-page/edit-2.svg";
import TrashIcon from "@/../public/images/home-page/trash.svg";
import CopyIcon from "@/../public/images/home-page/copy.svg";
import { GoInfo } from "react-icons/go";
import { formStatusPersian, formTypePersian } from "@/constants/formDictionaries";
import { InfoRow } from "@/components/common/infoRow";

interface ListCardProps {
    data: {
        id: string;
        name: string;
        type: string;
        status: string;
        accessType?: string;
        participants: number;
        questionListSize: number;
    };
    setRefreshGrid: (fn: (prev: any) => boolean) => void;
}

export default function ListCard({ data, setRefreshGrid }: ListCardProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const handleReport = () => {
        console.log("📢 گزارش کلیک شد");
        handleMenuClose();
    };

    const handlePublishStatus = useCallback(async () => {
        try {
            setLoading(true);
            const newStatus = data.status === "PUBLISH" ? "UN_PUBLISH" : "PUBLISH";
            const res = await AxiosApi.put("/form/change-status", {
                formId: data.id,
                formBuilderStatusEnum: newStatus,
            });
            if (res.data) {
                toast.success("عملیات با موفقیت انجام شد");
                setRefreshGrid((prev) => !prev);
            }
        } catch (error) {
            console.error(error);
            toast.error("عملیات ناموفق بود. مجدداً تلاش کنید.");
        } finally {
            setLoading(false);
        }
    }, [data.id, data.status, setRefreshGrid]);

    const handleCopy = useCallback(async () => {
        try {
            setLoading(true);
            const res = await AxiosApi.post(`/form/${data.id}/duplicate`);
            if (res.data) {
                toast.success("رونوشت با موفقیت انجام شد");
                setRefreshGrid((prev) => !prev);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [data.id, setRefreshGrid]);

    const handleDelete = async () => {
        try {
            setLoading(true);
            const res = await AxiosApi.delete(`/form/${data.id}`);
            if (res.data) {
                toast.success(`فرم (${data.name}) با موفقیت حذف شد`);
                setRefreshGrid((prev) => !prev);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
      <>
          <div className="border p-4 rounded-[20px] border-[#DDE1E6] flex flex-col gap-3 w-full max-w-ful relative">
              {/* منوی همبرگری */}


              <div className="flex justify-between items-center gap-4 flex-wrap">
                  <InfoRow label="نام:" value={data.name} bold />
                  <div className={"flex flex-row align-middle justify-items-center items-center gap-2"}>
                  {data.status !== "CREATE" && (
                    <SwitchButton
                      disabled={loading}
                      checked={data.status === "PUBLISH"}
                      onChange={handlePublishStatus}
                    />
                  )}
                  <div>
                      <IconButton onClick={handleMenuOpen} size="medium">
                          <GoInfo/>
                      </IconButton>
                      <Menu
                        anchorEl={menuAnchorEl}
                        open={Boolean(menuAnchorEl)}
                        onClose={handleMenuClose}
                        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                        transformOrigin={{ vertical: "top", horizontal: "left" }}
                      >
                          <MenuItem onClick={handleReport}>گزارش</MenuItem>
                      </Menu>
                  </div>
                  </div>
              </div>

              <InfoRow label="نوع:" value={formTypePersian[data.type]} bold />
              <InfoRow label="دسترسی:" value={data.accessType || "عمومی"} bold />
              <InfoRow label="تعداد شرکت‌کننده:" value={data.participants} bold />
              <InfoRow label="تعداد گویه:" value={data.questionListSize} bold />
              <InfoRow label="وضعیت:" value={formStatusPersian[data.status]} bold />

              <div className="flex gap-2 flex-wrap justify-center w-full">
                  <button
                    className="bg-[#1758BA] hover:bg-[#216ee1] transition-all duration-200 max-w-full px-2 h-[42px] grow text-sm rounded-lg text-white"
                    onClick={() => router.push(`/preview/${data.id}`)}
                  >
                      مشاهده
                  </button>

                  <IconButton onClick={() => setOpenConfirmDialog(true)} disabled={loading} color={"error"}>
                      <Image src={TrashIcon} alt="delete" width={24} height={24} />
                  </IconButton>

                  {(data.status === "READY_TO_PUBLISH" || data.status === "PUBLISH") && (
                    <PublishSettingsDialog formData={data} formId={data.id} />
                  )}

                  <IconButton onClick={handleCopy} disabled={loading}>
                      <Image src={CopyIcon} alt="copy" width={24} height={24} />
                  </IconButton>

                  {data.status === "CREATE" && (
                    <IconButton disabled={loading} color={"primary"}>
                        <Link href={`/builder/${data.id}`}>
                            <Image src={EditIcon} alt="edit" width={24} height={24} />
                        </Link>
                    </IconButton>
                  )}

                  <Link href={`/stats/${data.id}`}>
                      <IconButton disabled={loading}>
                          <AiOutlinePieChart color="#424242" />
                      </IconButton>
                  </Link>
              </div>
          </div>

          <ConfirmDialog
            open={openConfirmDialog}
            onClose={() => setOpenConfirmDialog(false)}
            title={`حذف فرم (${data.name})`}
            content="آیا از عملیات حذف کامل فرم اطمینان دارید؟"
            cancelText="انصراف"
            loading={loading}
            action={
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleDelete}
                  sx={{
                      fontWeight: "400",
                      fontSize: "15px",
                      height: "45px",
                      borderRadius: "8px",
                      "&:hover": {
                          bgcolor: (theme) => theme.palette.primary.main,
                      },
                  }}
                >
                    تایید
                </Button>
            }
          />
      </>
    );
}
