"use client";

import React, {useCallback, useState} from "react";
import {AxiosApi} from "@/services/axios/AxiosApi";
import {useRouter} from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {Button, IconButton} from "@mui/material";
import {toast} from "sonner";
import {AiOutlinePieChart} from "react-icons/ai";
import {SwitchButton} from "@/components/Switch/SwitchButton";
import ConfirmDialog from "../confirm-dialog";
import PublishSettingsDialog from "../PublishSettingsDialog/PublishSettingsDialog";
import EditIcon from "@/../public/images/home-page/edit-2.svg";
import TrashIcon from "@/../public/images/home-page/trash.svg";
import CopyIcon from "@/../public/images/home-page/copy.svg";
import {formStatusPersian, formTypePersian} from "@/constants/formDictionaries";
import {InfoRow} from "@/components/common/infoRow";

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

export default function ListCard({data, setRefreshGrid}: ListCardProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const handlePublishStatus = useCallback(async () => {
        try {
            setLoading(true);
            const newStatus = data.status === "PUBLISH" ? "UN_PUBLISH" : "PUBLISH";
            const res = await AxiosApi.put("/form/change-status", {
                formId: data.id, formBuilderStatusEnum: newStatus,
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

    return (<>
        <div className="border p-4 rounded-[20px] border-[#DDE1E6] flex flex-col gap-4 w-full max-w-full relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <InfoRow label="نام:" value={data.name} bold/>
                {data.status !== "CREATE" && (<SwitchButton
                    disabled={loading}
                    checked={data.status === "PUBLISH"}
                    onChange={handlePublishStatus}
                />)}
            </div>

            <div className="grid grid-cols-1 gap-2">
                <InfoRow label="نوع:" value={formTypePersian[data.type]} bold/>
                <InfoRow label="دسترسی:" value={data.accessType || "عمومی"} bold/>
                <InfoRow label="تعداد شرکت‌کننده:" value={data.participants} bold/>
                <InfoRow label="تعداد گویه:" value={data.questionListSize} bold/>
                <InfoRow label="وضعیت:" value={formStatusPersian[data.status]} bold/>
            </div>

            <div className="flex flex-wrap gap-2 w-full">
                <button
                    className="bg-[#1758BA] hover:bg-[#216ee1] transition-all duration-200 px-3 h-[42px] text-sm rounded-lg text-white grow sm:grow md:flex-1"
                    onClick={() => router.push(`/preview/${data.id}`)}
                >
                    مشاهده
                </button>

                <div className="flex gap-2 flex-wrap items-center justify-end">
                    <IconButton onClick={() => setOpenConfirmDialog(true)} disabled={loading} color="error">
                        <Image src={TrashIcon} alt="delete" width={24} height={24}/>
                    </IconButton>

                    {(data.status === "READY_TO_PUBLISH" || data.status === "PUBLISH") && (
                        <PublishSettingsDialog formData={data} formId={data.id}/>)}

                    <IconButton onClick={handleCopy} disabled={loading}>
                        <Image src={CopyIcon} alt="copy" width={24} height={24}/>
                    </IconButton>

                    {data.status === "CREATE" && (<Link href={`/builder/${data.id}`}>
                        <IconButton disabled={loading} color="primary">
                            <Image src={EditIcon} alt="edit" width={24} height={24}/>
                        </IconButton>
                    </Link>)}

                    <Link href={`/src/app/stats/${data.id}`}>
                        <IconButton disabled={loading}>
                            <AiOutlinePieChart color="#424242"/>
                        </IconButton>
                    </Link>
                </div>
            </div>
        </div>

        <ConfirmDialog
            open={openConfirmDialog}
            onClose={() => setOpenConfirmDialog(false)}
            title={`حذف فرم (${data.name})`}
            content="آیا مطمئن هستید که می‌خواهید این فرم را به‌طور کامل حذف کنید؟"
            cancelText="انصراف"
            loading={loading}
            action={<Button
                fullWidth
                variant="contained"
                onClick={handleDelete}
                sx={{
                    fontWeight: "400", fontSize: "15px", height: "45px", borderRadius: "8px", "&:hover": {
                        bgcolor: (theme) => theme.palette.primary.main,
                    },
                }}
            >
                تایید
            </Button>}
        />
    </>);
}