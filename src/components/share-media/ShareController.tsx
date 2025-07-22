"use client";
import {Snackbar, SnackbarCloseReason} from "@mui/material";
import {type FC, useState} from "react";
import {GrCircleInformation} from "react-icons/gr";

const ShareController: FC<Props> = ({
  children,
  shareData,
  onInteraction,
  onSuccess,
  onError,
  disabled,
}) => {
  const [openError, setOpenError] = useState(false);

  const handleOnClick = async () => {
    onInteraction?.();
    if (navigator?.share) {
      try {
        await navigator.share(shareData);
        onSuccess?.();
      } catch (err) {
        onError?.(err);
      }
    } else {
      setOpenError(true);
    }
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenError(false);
  };

  return (
    <>
      <button onClick={handleOnClick} type="button" disabled={disabled}>
        {children}
      </button>
      <Snackbar
        message={
          <div className="flex gap-2 items-center">
            <GrCircleInformation strokeWidth={0.5} size="1.4rem" />
            <p>مرورگر شما از این ویژگی پشتیبانی نمی کند</p>
          </div>
        }
        ContentProps={{
          style: {
            backgroundColor: "#dc2626",
            color: "#FFF",
          },
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={2500}
        onClose={handleClose}
        open={openError}
      />
    </>
  );
};

interface Props {
  children: React.ReactNode;
  shareData: ShareData;
  onSuccess?: () => void;
  onError?: (error?: unknown) => void;
  onInteraction?: () => void;
  disabled?: boolean;
}

export default ShareController;
