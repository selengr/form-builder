"use client";

import {Fragment, memo, MouseEvent, useCallback, useState} from "react";
import Menu from "@mui/material/Menu";
import Typography from "@mui/material/Typography";
import {WeuiDeleteOutlined} from "@/../public/images/icons/DeleteIcon";
import {IonCopyOutline} from "@/../public/images/icons/CopyIcon";
import {PhDotsThreeVerticalBold} from "@/../public/images/icons/PhDotsThreeVerticalBold";
import {SlPencil} from "react-icons/sl";
import useActionOpenDialog from "@/hooks/useActionOpenDialog";
import useElements from "@/hooks/useElements";
import useActionSelectedElement from "@/hooks/useActionSelectedElement";
import useActionQuestionLoading from "@/hooks/useActionQuestionLoading";
import useActionDesigner from "@/hooks/useActionDesigner";
import {AxiosApi} from "@/services/axios/AxiosApi";
import {toast} from "sonner";
import {Button} from "@mui/material";

const QuestionMenu = memo(function QuestionMenu({
  questionID,
  position,
  index,
}: {
  questionID: number;
  position: number;
  index: number;
}) {
  const setOpenDialog = useActionOpenDialog();
  const elements = useElements();
  const setSelectedElement = useActionSelectedElement();
  const setQuestionLoading = useActionQuestionLoading();
  const { removeElement, addElement } = useActionDesigner();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [loadingDeleteData, setLoadingDeleteData] = useState(false);
  const [loadingDuplicateData, setLoadingDuplicateData] = useState(false);

  async function getQuestionData() {
    const realPositionInElements = elements.findIndex(
      (el: any) => el.questionId === questionID
    );
    handleClose();
    setOpenDialog(true);
    setQuestionLoading(true);
    try {
      const { data } = await AxiosApi.get(`/question/${questionID}`);
      setQuestionLoading(false);
      setSelectedElement({
        fieldElement: data,
        position: {
          apiPosition: index,
          realPosition: realPositionInElements,
        },
      });
    } catch (error) {
      setOpenDialog(false);
      setQuestionLoading(false);
    }
  }

  const handleClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    if (loadingDeleteData || loadingDuplicateData) return;
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
              // willChange: "transform, opacity",
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
            sx={{
              display: "flex",
              justifyContent: "space-between",
              color: "#222",
              paddingX: "10px",
            }}
            onClick={async (e) => {
              e.stopPropagation();
              try {
                setLoadingDuplicateData(true);
                const res = await AxiosApi.post(
                  `/question/${questionID}/duplicate`
                );
                delete res.data.questionPropertyList;
                delete res.data.optionList;
                delete res.data.spectralPlaceList;
                const newQuestion = {
                  ...res.data,
                };
                // addElement(position, newQuestion);
                addElement(position + 1, newQuestion);
              } catch (error) {
                toast.error("خطایی رخ داده است");
              } finally {
                setAnchorEl(null);
                setLoadingDuplicateData(false);
              }
            }}
            fullWidth
            disabled={loadingDeleteData}
            loading={loadingDuplicateData}
          >
            <Typography>تکثیر</Typography>
            <IonCopyOutline width={18} height={18} />
          </Button>
          <Button
            disabled={loadingDeleteData || loadingDuplicateData}
            sx={{
              paddingX: "10px",
              display: "flex",
              justifyContent: "space-between",
              color: "#1758BA",
            }}
            fullWidth
            onClick={getQuestionData}
          >
            <Typography>ویرایش</Typography>
            <SlPencil size="1.15rem" />
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
              try {
                setLoadingDeleteData(true);
                const res = await AxiosApi.delete(`/question/${questionID}`);
                if (res?.data?.response) {
                  removeElement(questionID);
                } else {
                  toast.error("عملیات ناموفق بود مجددا تلاش نمایید");
                }
              } catch (error) {
                toast.error("خطایی رخ داده است");
              } finally {
                setAnchorEl(null);
                setLoadingDeleteData(false);
              }
            }}
            fullWidth
            disabled={loadingDuplicateData}
            loading={loadingDeleteData}
          >
            <Typography>حذف</Typography>
            <WeuiDeleteOutlined width={20} height={20} />
          </Button>
        </Menu>
      )}
    </Fragment>
  );
});

export default QuestionMenu;
