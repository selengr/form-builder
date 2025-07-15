"use client";

import {Fragment, memo, MouseEvent, useCallback, useState} from "react";
import Menu from "@mui/material/Menu";
import useDesigner from "@/hooks/useDesigner";
import Typography from "@mui/material/Typography";
import {WeuiDeleteOutlined} from "@/../public/images/icons/DeleteIcon";
import {PhDotsThreeVerticalBold} from "@/../public/images/icons/PhDotsThreeVerticalBold";
import {toast} from "react-hot-toast";
import {SlPencil} from "react-icons/sl";
import {useParams} from "next/navigation";
import {FormElementInstance} from "@/types/FormElements";
import useActionOpenDialog from "@/hooks/useActionOpenDialog";
import useActionSelectedElement from "@/hooks/useActionSelectedElement";
import useActionDesigner from "@/hooks/useActionDesigner";
import {AxiosApi} from "@/services/axios/AxiosApi";
import {Button} from "@mui/material";

const NoDndPopUpMenu = memo(function NoDndPopUpMenu({
  element,
}: {
  element: FormElementInstance;
}) {
  const setOpenDialog = useActionOpenDialog();
  const setSelectedElement = useActionSelectedElement();
  const { removeStartPage, removeFinishPage } = useActionDesigner();
  const { finishPage } = useDesigner();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  async function fetchData() {
    if (element.questionType === "TitleFieldStart") {
      try {
        setLoading(true);
        const res = await AxiosApi.put("/form/start-page", {
          formId: id,
          startPageMsg: null,
        });
        if (!res.data.startPageMsg) {
          removeStartPage();
          toast.success("صفحه شروع با موفقیت حذف شد");
        } else {
          toast.error("عملیات ناموفق بود مجددا تلاش نمایید");
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    } else if (element.questionType === "TitleFieldFinish") {
      try {
        setLoading(true);
        const { data }: any = await AxiosApi.delete(
          `/form/end-page/${finishPage?.questionId}`
        );
        if (data.response) {
          removeFinishPage();
          toast.success("صفحه پایان با موفقیت حذف شد");
        } else {
          toast.error("عملیات ناموفق بود مجددا تلاش نمایید");
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
  }

  const handleClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    if (loading) return;
    setAnchorEl(null);
  }, []);

  return (
    <Fragment>
      <button onClick={handleClick}>
        <PhDotsThreeVerticalBold color="#1758BA" fontSize="1.5rem" />
      </button>
      {open && (
        <Menu
          sx={{
            "& .MuiPaper-root.MuiPaper-elevation": {
              borderRadius: "15px",
            },
            "& .MuiPaper-root": {
              touchAction: "none",
              width: "125px",
            },
            "& .MuiLoadingButton-label": {
              width: "100%",
            },
          }}
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <Button
            disabled={loading}
            sx={{
              paddingX: "10px",
              height: "36px",
              borderRadius: "10px",
              width: "100%",
              display: "flex",
              flexDirection: "row-reverse",
              justifyContent: "space-between",
              color: "#1758BA",
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (loading) return;
              handleClose();
              setSelectedElement({ fieldElement: element, position: null });
              setOpenDialog(true);
            }}
          >
            <Typography>ویرایش</Typography>
            <SlPencil size="1.18rem" />
          </Button>
          <Button
            sx={{
              paddingX: "10px",
              display: "flex",
              justifyContent: "space-between",
              color: "#FA4D56",
            }}
            onClick={async (e) => {
              e.stopPropagation();
              fetchData();
            }}
            fullWidth
            disabled={loading}
            loading={loading}
          >
            <Typography>حذف</Typography>
            <WeuiDeleteOutlined fontSize="1.32rem" />
          </Button>
        </Menu>
      )}
    </Fragment>
  );
});

export default NoDndPopUpMenu;
