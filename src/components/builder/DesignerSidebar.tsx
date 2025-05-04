"use client";

import {Fragment, memo, useCallback, useMemo, useState,} from "react";
import {IconButton, useMediaQuery,} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {useMutation} from "@tanstack/react-query";
import {useParams} from "next/navigation";
import Link from "next/link";
import {toast} from "sonner";

import {FormElements} from "@/types/FormElements";
import AxiosApi from "@/services/axios/AxiosApi";
import useDesigner from "@/hooks/useDesigner";
import SidebarBtnElement from "./SidebarBtnElement";
import {CodiconEye} from "@/../public/images/home-page/EyeIcon";
import SettingsDialog from "../SettingsDialog/SettingsDialog";
import DesignerBottomSheet from "./DesignerBottomSheet";

const ELEMENTS = [
  FormElements.TEXT_FIELD,
  FormElements.MULTIPLE_CHOICE,
  FormElements.MULTIPLE_CHOICE_IMAGE,
  FormElements.SPECTRAL,
  FormElements.INFO_FIELD,
];

// eslint-disable-next-line react/display-name
const DesignerSidebar = memo(() => {
  const {id} = useParams();
  const isDesktop = useMediaQuery("(min-width:1280px)");
  const {formName, formSetting} = useDesigner();
  const [formTitle, setFormTitle] = useState(formName);

  const {mutate, isPending} = useMutation({
    mutationFn: () => AxiosApi.put(`/form/ready-to-publish/${id}`),
    onSuccess: () => toast.success("عملیات با موفقیت انجام شد"),
    onError: () => toast.error("عملیات ناموفق بود مجددا تلاش کنید"),
  });

  const handlePublish = useCallback(() => mutate(), [mutate]);

  const renderElements = useMemo(() => (
    ELEMENTS.map((el, index) => <SidebarBtnElement key={index} formElement={el} disabled={formSetting.formStatus !== "CREATE"}/>)
  ), []);

  const TopBar = (
    <div className="flex justify-between items-center gap-1 bg-[#F7F7F7] px-4 py-2 rounded-lg">
      <p className="text-[16px] text-[#2a2a2a] font-bold break-words whitespace-pre-wrap">
        {formTitle}
      </p>
      <div className="flex gap-2">
        <Link href={`/preview/${id}`}>
          <IconButton sx={{height: 40, width: 40}}>
            <CodiconEye color="#2A2A2A"/>
          </IconButton>
        </Link>
        <SettingsDialog formName={formTitle} onChangeName={setFormTitle}/>
      </div>
    </div>
  );

  const PublishButton = (
    <LoadingButton
      onClick={handlePublish}
      variant="contained"
      loading={isPending}
      disabled={isPending || formSetting.formStatus !== "CREATE"}
      sx={{
        backgroundColor: "#1758BA",
        fontWeight: 500,
        fontSize: 15,
        borderRadius: "10px",
        height: 58,
        mt: 1,
        "&:hover": {
          backgroundColor: "#1758BA",
        },
        minWidth: 132,
      }}
    >
      <p className="text-white font-bold text-[15px]">
        {formSetting.formStatus === "CREATE" ? "آماده برای انتشار" : "منتشر شده"}
      </p>
    </LoadingButton>
  );

  if (isDesktop) {
    return (
      <div
        dir="rtl"
        className="bg-white rounded-2xl sticky top-4 right-0 w-[400px] max-w-[400px] border-[1.5px] border-[#DDE1E6] overflow-y-scroll select-none flex flex-col py-4 px-2 gap-2"
        style={{scrollbarWidth: "none", height: "calc(100vh - 100px)"}}
      >
        {TopBar}
        <div className="p-4 rounded-lg h-full flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2">{renderElements}</div>
        </div>
        {PublishButton}
      </div>
    );
  }

  return (
    <Fragment>
      <div
        dir="rtl"
        className="right-0 w-full flex flex-col rounded-[10px] gap-2 p-4 bg-[#f7f7f7]"
      >
        {TopBar}
        {PublishButton}
      </div>
      <DesignerBottomSheet>
        <div className="flex flex-col w-full gap-3">
          {renderElements}
        </div>
      </DesignerBottomSheet>
    </Fragment>
  );
});

export default DesignerSidebar;
