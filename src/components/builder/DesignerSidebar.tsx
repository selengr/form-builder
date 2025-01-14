import { Fragment, memo } from "react";
import { FormElements } from "@/types/FormElements";
import SidebarBtnElement from "./SidebarBtnElement";
import IconButton from "@mui/material/IconButton";
import { CodiconEye } from "@/../public/images/home-page/EyeIcon";
import Link from "next/link";
import { useParams } from "next/navigation";
import useDesigner from "@/hooks/useDesigner";
import DesignerBottomSheet from "./DesignerBottomSheet";
import useMediaQuery from "@mui/material/useMediaQuery";
import SettingsDialog from "../SettingsDialog/SettingsDialog";

const DesignerSidebar = memo(function DesignerSidebar() {
  const { formName } = useDesigner();
  const { id } = useParams();
  const isDesktop = useMediaQuery("(min-width:1280px)");

  return isDesktop ? (
    <div
      dir="rtl"
      className={`bg-white rounded-2xl sticky right-0 w-[400px] max-w-[400px] flex flex-col flex-grow border-[#DDE1E6] border-[1.5px] overflow-y-scroll select-none gap-2 py-4 px-2 ${
        isDesktop ? "top-4" : "top-auto"
      } ${isDesktop ? "h-[calc(100vh-100px)]" : "h-auto"}`}
      style={{
        scrollbarWidth: "none",
      }}
    >
      <div className="flex justify-between items-center gap-1 bg-[#F7F7F7] px-4 py-2 rounded-lg">
        <div className="flex items-baseline">
          <p
            className="text-[16px] text-[#2a2a2a] font-bold"
            style={{
              wordBreak: "break-word",
              whiteSpace: "pre-wrap",
            }}
          >
            {formName}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/preview/${id}`}>
            <IconButton
              sx={{
                height: "100%",
                width: "40px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CodiconEye color="#2A2A2A" />
            </IconButton>
          </Link>
          <SettingsDialog />
        </div>
      </div>

      <div className="p-4 rounded-lg h-full flex flex-col justify-between gap-4">
        <div className="flex flex-col w-full bg-white gap-2">
          <SidebarBtnElement formElement={FormElements.TEXT_FIELD} />
          <SidebarBtnElement formElement={FormElements.MULTIPLE_CHOICE} />
          <SidebarBtnElement formElement={FormElements.MULTIPLE_CHOICE_IMAGE} />
          <SidebarBtnElement formElement={FormElements.SPECTRAL} />
          <SidebarBtnElement formElement={FormElements.INFO_FIELD} />
        </div>
      </div>
      <button className="h-[58px] w-full rounded-[10px] mt-2 shadow-none bg-[#1758BA]">
        <p className="text-white text-[15px] font-bold">ذخیره و انتشار</p>
      </button>
    </div>
  ) : (
    <Fragment>
      <div
        dir="rtl"
        className="right-0 w-full flex flex-col lg:bg-white rounded-[10px] select-none gap-2 p-4 bg-[#f7f7f7]"
      >
        <div className="flex justify-between items-center gap-1">
          <div className="flex items-center">
            <p
              className="text-[16px] text-[#2a2a2a] font-bold"
              style={{
                wordBreak: "break-word",
                whiteSpace: "pre-wrap",
              }}
            >
              {formName}
            </p>
          </div>

          <div className="flex gap-2">
            <Link href={`/preview/${id}`}>
              <IconButton
                sx={{
                  height: "40px",
                  width: "40px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CodiconEye color="#2A2A2A" />
              </IconButton>
            </Link>
            <SettingsDialog />
          </div>
        </div>
        <button className="h-[58px] w-full rounded-[10px] mt-2 shadow-none bg-[#1758BA]">
          <p className="text-white text-[15px] font-bold">ذخیره و انتشار</p>
        </button>
      </div>
      <DesignerBottomSheet>
        <div className="flex flex-col w-full gap-3">
          <SidebarBtnElement formElement={FormElements.TEXT_FIELD} />
          <SidebarBtnElement formElement={FormElements.MULTIPLE_CHOICE} />
          <SidebarBtnElement formElement={FormElements.MULTIPLE_CHOICE_IMAGE} />
          <SidebarBtnElement formElement={FormElements.SPECTRAL} />
          <SidebarBtnElement formElement={FormElements.INFO_FIELD} />
        </div>
      </DesignerBottomSheet>
    </Fragment>
  );
});

export default DesignerSidebar;
