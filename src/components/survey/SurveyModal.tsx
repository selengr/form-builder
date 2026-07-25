"use client";

import type React from "react";
import { CgClose } from "react-icons/cg";
import { ImSpinner2 } from "react-icons/im";
import type { DialogProps } from "@mui/material";
import { useState, useMemo } from "react";
import { Dialog, IconButton, Box, SxProps, Theme } from "@mui/material";

const MODAL_SIZES = {
    small: { width: 400, height: 400 },
    medium: { width: 600, height: 500 },
    large: { width: 800, height: 600 },
    full: { width: "100%", height: "100%" },
} as const;

export type SurveyModalSize = keyof typeof MODAL_SIZES;

export interface SurveyModalProps {
    open: boolean;
    onClose: () => void;
    surveyUrl: string;
    size?: SurveyModalSize;
    customWidth?: number | string;
    customHeight?: number | string;
    customStyles?: SxProps<Theme>;
    iframeTitle?: string;
    showCloseButton?: boolean;
    closeButtonLabel?: string;
    closeOnBackdropClick?: boolean;
    borderRadius?: number;
    iframeProps?: React.IframeHTMLAttributes<HTMLIFrameElement>;
}

/**
*
* @example
* ```tsx
*
* <SurveyModal
* open={isOpen}
* onClose={() => setIsOpen(false)}
* surveyUrl="https://form/survey-your-rest-url.ir"
* size="medium"
* />
* ```
*/
export function SurveyModal({
    open,
    onClose,
    surveyUrl,
    size = "medium",
    customWidth,
    customHeight,
    customStyles,
    iframeTitle = "Survey",
    showCloseButton = true,
    closeButtonLabel = "Close",
    closeOnBackdropClick = false,
    borderRadius = 3,
    iframeProps = {},
}: SurveyModalProps) {
    const isRTL = typeof document !== "undefined" &&
        document.documentElement.dir === "rtl"
    const [loading, setLoading] = useState(true);
    const handleIframeLoad = () => setLoading(false);


    const config = useMemo(
        () => ({
            width: customWidth || MODAL_SIZES[size].width,
            height: customHeight || MODAL_SIZES[size].height,
        }),
        [size, customWidth, customHeight]
    );

    const handleClose: DialogProps["onClose"] = (_: any, reason?: string) => {
        if (reason === "backdropClick" && !closeOnBackdropClick) {
            return;
        }
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
                sx: {
                    width: config.width,
                    height: config.height,
                    maxWidth: "none",
                    overflow: "hidden",
                    borderRadius,
                    ...customStyles,
                },
            }}
        >
            {showCloseButton && (
                <IconButton
                    onClick={onClose}
                    aria-label={closeButtonLabel}
                    sx={{
                        position: "absolute",
                        top: 15,
                        right: isRTL ? "auto" : 12,
                        left: isRTL ? 12 : "auto",
                        zIndex: 10,
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        "&:hover": { backgroundColor: "rgba(255, 255, 255, 1)" },
                    }}
                >
                    {CgClose({ size: "1.5rem", color: "#404040" })}
                </IconButton>
            )}

            <Box sx={{ width: "100%", height: "100%" }} aria-busy={loading}>
                {loading && (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        sx={{ width: "100%", height: "100%" }}
                    >
                        {ImSpinner2({ className: "animate-spin h-12 w-12" })}
                    </Box>
                )}
                <iframe
                    onLoad={handleIframeLoad}
                    src={surveyUrl.trim()}
                    style={{
                        width: "100%", height: "100%", border: "none", visibility:
                            loading ? "hidden" : "visible"
                    }}
                    title={iframeTitle}
                    allowFullScreen
                    {...iframeProps}
                />
            </Box>
        </Dialog>
    );
}

export default SurveyModal;