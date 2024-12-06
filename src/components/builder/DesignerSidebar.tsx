import { Fragment, memo } from "react";
import { FormElements } from "@/types/FormElements";
import SidebarBtnElement from "./SidebarBtnElement";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { CodiconEye } from "@/../public/images/home-page/EyeIcon";
import Link from "next/link";
import { useParams } from "next/navigation";
import useDesigner from "@/hooks/useDesigner";
import { IoSettingsOutline } from "react-icons/io5";
import DesignerBottomSheet from "./DesignerBottomSheet";
import useMediaQuery from "@mui/material/useMediaQuery";

const DesignerSidebar = memo(function DesignerSidebar() {
  const { formName } = useDesigner();
  const { id } = useParams();
  const isDesktop = useMediaQuery("(min-width:1280px)");

  return isDesktop ? (
    <div
      dir="rtl"
      className={`bg-white sticky right-0 w-[400px] max-w-[400px] flex flex-col flex-grow overflow-y-scroll rounded-[10px] select-none gap-2 py-4 px-2 ${
        isDesktop ? "top-[18px]" : "top-auto"
      } ${isDesktop ? "h-[96vh]" : "h-auto"}`}
      style={{
        scrollbarWidth: "none",
      }}
    >
      <div className="flex justify-between items-center gap-1">
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
          <IconButton
            sx={{
              height: "100%",
              width: "40px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IoSettingsOutline color="#2A2A2A" />
          </IconButton>
        </div>
      </div>

      <div className="p-4 rounded-lg h-full flex flex-col justify-between gap-4">
        <div className="flex flex-col w-full bg-white gap-2">
          <SidebarBtnElement formElement={FormElements.TEXT_FIELD} />
          <SidebarBtnElement formElement={FormElements.MULTIPLE_CHOICE} />
          <SidebarBtnElement formElement={FormElements.MULTIPLE_CHOICE_IMAGE} />
          <SidebarBtnElement formElement={FormElements.SPECTRAL} />
        </div>
      </div>
      <Button
        variant="contained"
        sx={{
          height: "58px",
          width: "100%",
          borderRadius: "10px",
          marginTop: 1,
          boxShadow: "none",
          backgroundColor: "#1758BA",
          "&.MuiButtonBase-root:hover": {
            backgroundColor: "#1758BA",
            boxShadow: "none",
          },
        }}
      >
        <p className="text-white text-[15px] font-bold">ذخیره و انتشار</p>
      </Button>
    </div>
  ) : (
    <Fragment>
      <div
        dir="rtl"
        className="right-0 w-full flex flex-col bg-white rounded-[10px] select-none gap-2 p-4"
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
            <IconButton
              sx={{
                height: "40px",
                width: "40px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <IoSettingsOutline color="#2A2A2A" />
            </IconButton>
          </div>
        </div>
      </div>
      <DesignerBottomSheet>
        <div className="flex flex-col w-full gap-3">
          <SidebarBtnElement formElement={FormElements.TEXT_FIELD} />
          <SidebarBtnElement formElement={FormElements.MULTIPLE_CHOICE} />
          <SidebarBtnElement formElement={FormElements.MULTIPLE_CHOICE_IMAGE} />
          <SidebarBtnElement formElement={FormElements.SPECTRAL} />
        </div>
      </DesignerBottomSheet>
    </Fragment>
  );
});

export default DesignerSidebar;
