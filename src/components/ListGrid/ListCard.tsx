import { useState } from "react";
import { SwitchButton } from "@/components/Switch/SwitchButton";
import { IconButton } from "@mui/material";
import Image from "next/image";
import EditIcon from "@/../public/images/home-page/edit-2.svg";
import TrashIcon from "@/../public/images/home-page/trash.svg";
import CopyIcon from "@/../public/images/home-page/copy.svg";
import Link from "next/link";
import { LoadingButton } from "@mui/lab";
import AxiosApi from "@/services/axios/AxiosApi";
import { toast } from "sonner";
import ConfirmDialog from "../confirm-dialog";
import { useRouter } from "next/navigation";
import PublishSettingsDialog from "../PublishSettingsDialog/PublishSettingsDialog";
import { IoStatsChartOutline } from "react-icons/io5";

const formTypePersian: any = {
  TEST: "آزمون",
  QUESTION: "پرسشنامه",
  SURVEY: "نظرسنجی",
  COMPETITION: "مسابقه",
};

export default function ListCard(props: any) {
  const [loadingInvalidData, setLoadingInvalidData] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const router = useRouter();

  async function handleInvalid(e: any) {
    try {
      setLoadingInvalidData(true);
      const res: any = await AxiosApi.put("/form/invalid", {
        id: props.data.id,
        invalid: !e.target.checked,
      });
      if (res.data) {
        console.log(res.data);
        toast.success("عملیات با موفقیت انجام شد");
        props.setRefreshGrid((prev: any) => !prev);
      }
    } catch (error) {
      console.log(error);
      toast.error("عملیات ناموفق بود مجددا امتحان فرمایید");
    } finally {
      setLoadingInvalidData(false);
    }
  }

  async function handleCopy() {
    try {
      setLoadingInvalidData(true);
      const res: any = await AxiosApi.post(`/form/${props.data.id}/duplicate`);

      if (res.data) {
        toast.success("عملیات با موفقیت انجام شد");
        props.setRefreshGrid((prev: any) => !prev);
      }
    } catch (error) {
      console.log(error);
      toast.error("خطایی رخ داده است");
    } finally {
      setLoadingInvalidData(false);
    }
  }

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
          <div>
            <SwitchButton
              disabled={loadingInvalidData}
              checked={!props.data.invalid}
              onChange={handleInvalid}
            />
          </div>
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
            disabled={loadingInvalidData}
          >
            <Image src={TrashIcon} alt="" width={24} height={24} />
          </IconButton>
          <PublishSettingsDialog />
          <IconButton onClick={handleCopy} disabled={loadingInvalidData}>
            <Image src={CopyIcon} alt="" width={24} height={24} />
          </IconButton>
          <IconButton disabled={loadingInvalidData}>
            <Link href={`/builder/${props.data.id}`}>
              <Image src={EditIcon} alt="" width={24} height={24} />
            </Link>
          </IconButton>
          <IconButton disabled={loadingInvalidData}>
            <Link href={`/stats/${props.data.id}`} className="h-full w-full">
              <IoStatsChartOutline color="#424242" />
            </Link>
          </IconButton>
        </div>
      </div>
      <ConfirmDialog
        content="آیا از عملیات حذف کامل فرم اطمینان دارید؟"
        open={openConfirmDialog}
        title={`حذف فرم (${props.data.name})`}
        loading={loadingInvalidData}
        onClose={() => setOpenConfirmDialog(false)}
        cancelText="انصراف"
        action={
          <LoadingButton
            type="submit"
            fullWidth
            disableRipple
            variant="contained"
            loading={loadingInvalidData}
            sx={{
              fontWeight: "400",
              fontSize: "15px",
              height: "45px",
              borderRadius: "8px",
              "&.MuiButtonBase-root:hover": {
                bgcolor: (theme) => theme.palette.primary.main,
              },
            }}
            onClick={async () => {
              try {
                setLoadingInvalidData(true);
                const res: any = await AxiosApi.delete(
                  `/form/${props.data.id}`
                );
                if (res.data) {
                  toast.success(`فرم (${props.data.name}) با موفقیت حذف شد`);
                  props.setRefreshGrid((prev: any) => !prev);
                }
              } catch (error) {
                console.log(error);
                toast.error("خطایی رخ داده است");
              } finally {
                setLoadingInvalidData(false);
              }
            }}
          >
            تایید
          </LoadingButton>
        }
      />
    </>
  );
}
