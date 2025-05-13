"use client";
import {useState} from "react";
import {SwitchButton} from "@/components/Switch/SwitchButton";
import {Button, IconButton} from "@mui/material";
import Image from "next/image";
import EditIcon from "@/../public/images/home-page/edit-2.svg";
import TrashIcon from "@/../public/images/home-page/trash.svg";
import CopyIcon from "@/../public/images/home-page/copy.svg";
import Link from "next/link";
import AxiosApi from "@/services/axios/AxiosApi";
import {toast} from "sonner";
import ConfirmDialog from "../confirm-dialog";
import {useRouter} from "next/navigation";
import PublishSettingsDialog from "../PublishSettingsDialog/PublishSettingsDialog";
import {AiOutlinePieChart} from "react-icons/ai";
import { AxiosError } from "axios";

const formTypePersian: any = {
  TEST: "آزمون",
  QUESTION: "پرسشنامه",
  SURVEY: "نظرسنجی",
  COMPETITION: "مسابقه",
};

export const formStatusPersian: any = {
  CREATE: "ایجاد شده",
  PUBLISH: "انتشار یافته",
  UN_PUBLISH: "عدم انتشار",
  READY_TO_PUBLISH: "آماده برای انتشار",
};

export default function ListCard(props: any) {
  console.log(props.data.status);

  const [loadingPublishStatus, setLoadingPublishStatus] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const router = useRouter();

  async function handlePublishStatus(e: any) {
    try {
      setLoadingPublishStatus(true);
      const res: any = await AxiosApi.put("/form/change-status", {
        formId: props.data.id,
        formBuilderStatusEnum:
          props.data.status === "PUBLISH" ? "UN_PUBLISH" : "PUBLISH",
      });
      if (res.data) {
        toast.success("عملیات با موفقیت انجام شد");
        props.setRefreshGrid((prev: any) => !prev);
      }
    } catch (error) {
      console.log(error);
      toast.error("عملیات ناموفق بود مجددا امتحان فرمایید");
    } finally {
      setLoadingPublishStatus(false);
    }
  }

  async function handleCopy() {
    try {
      setLoadingPublishStatus(true);
      const res: any = await AxiosApi.post(`/form/${props.data.id}/duplicate`);

      if (res.data) {
        toast.success("عملیات با موفقیت انجام شد");
        props.setRefreshGrid((prev: any) => !prev);
      }
    } catch (error) {
      console.log(error);
      toast.error("خطایی رخ داده است");
    } finally {
      setLoadingPublishStatus(false);
    }
  }

  const handleDelete = async () => {
    try {
      setLoadingPublishStatus(true);
      const res: any = await AxiosApi.delete(`/form/${props.data.id}`);
      if (res.data) {
        toast.success(`فرم (${props.data.name}) با موفقیت حذف شد`);
        props.setRefreshGrid((prev: any) => !prev);
      }
    } catch (error) {
      const axiosError = error as any      
      const errorMessage = axiosError.response?.data?.message?.[0]?.title || "خطایی رخ داده است";
      toast.error(errorMessage);
    } finally {
      setLoadingPublishStatus(false);
    }
  };
  
  return (
    <>
      <div className="border-[1px] flex flex-col gap-3 rounded-[20px] border-[#DDE1E6] p-4">
        <div className="flex justify-between gap-4 items-center">
          <div className="flex gap-1 text-[#393939]">
            <span className="text-[14px]">نام:</span>
            <p
              className="text-[14px] font-bold"
              style={{
                wordBreak: "break-word",
                whiteSpace: "pre-wrap",
              }}
            >
              {props.data.name}
            </p>
          </div>
          {props.data.status !== "CREATE" && (
            <div>
              <SwitchButton
                disabled={loadingPublishStatus}
                checked={props.data.status === "PUBLISH"}
                onChange={handlePublishStatus}
              />
            </div>
          )}
        </div>
        <div className="flex gap-1 text-[#393939]">
          <span className="text-[14px]">نوع:</span>
          <p>{formTypePersian[props.data.type]}</p>
        </div>
        <div className="flex gap-1 text-[#393939]">
          <span className="text-[14px]">دسترسی:</span>
          <p className="text-[14px] font-bold">
            {props.data.accessType ? props.data.accessType : "عمومی"}
          </p>
        </div>
        <div className="flex gap-1 text-[#393939]">
          <span className="text-[14px]">تعداد شرکت‌کننده:</span>
          <p className="text-[14px] font-bold">{props.data.participants}</p>
        </div>
        <div className="flex gap-1 text-[#393939]">
          <span className="text-[14px]">تعداد گویه:</span>
          <p className="text-[14px] font-bold">{props.data.questionListSize}</p>
        </div>
        <div className="flex gap-1 text-[#393939]">
          <span className="text-[14px]">وضعیت:</span>
          <p className="text-[14px] font-bold">
            {formStatusPersian[props.data.status]}
          </p>
        </div>
        <div className="flex w-full gap-2 justify-center">
          <button
            className="bg-[#1758BA] hover:bg-[#216ee1] transition-all duration-200 max-w-[350px] px-2 h-[36px] w-full text-[14px] rounded-lg text-white"
            onClick={() => {
              router.push(`/preview/${props.data.id}`);
            }}
          >
            مشاهده
          </button>

          <IconButton
            onClick={() => {
              setOpenConfirmDialog((prev) => !prev);
            }}
            disabled={loadingPublishStatus}
          >
            <Image src={TrashIcon} alt="" width={24} height={24} />
          </IconButton>
          {props.data.status === "READY_TO_PUBLISH" && (
            <PublishSettingsDialog
              formData={props.data as any}
              formId={props.data.id as any}
            />
          )}
          <IconButton onClick={handleCopy} disabled={loadingPublishStatus}>
            <Image src={CopyIcon} alt="" width={24} height={24} />
          </IconButton>

          {props.data.status === "CREATE" && (
            <IconButton disabled={loadingPublishStatus}>
              <Link href={`/builder/${props.data.id}`}>
                <Image src={EditIcon} alt="" width={24} height={24} />
              </Link>
            </IconButton>
          )}
          <IconButton disabled={loadingPublishStatus}>
            <Link href={`/stats/${props.data.id}`} className="h-full w-full">
              <AiOutlinePieChart color="#424242" />
            </Link>
          </IconButton>
        </div>
      </div>
      <ConfirmDialog
        content="آیا از عملیات حذف کامل فرم اطمینان دارید؟"
        open={openConfirmDialog}
        title={`حذف فرم (${props.data.name})`}
        loading={loadingPublishStatus}
        onClose={() => setOpenConfirmDialog(false)}
        cancelText="انصراف"
        action={
          <Button
            type="submit"
            fullWidth
            disableRipple
            variant="contained"
            loading={loadingPublishStatus}
            sx={{
              fontWeight: "400",
              fontSize: "15px",
              height: "45px",
              borderRadius: "8px",
              "&.MuiButtonBase-root:hover": {
                bgcolor: (theme) => theme.palette.primary.main,
              },
            }}
            onClick={handleDelete}
          >
            تایید
          </Button>
        }
      />
    </>
  );
}
