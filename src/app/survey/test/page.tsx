"use client";

import { useState } from "react";
import { Dialog, Button, Box } from "@mui/material";

const MODAL_SIZES = {
    small: { width: "400px", height: "400px" },
    medium: { width: "600px", height: "500px" },
    large: { width: "800px", height: "600px" },
    full: { width: "100%", height: "100%" },
} as const;

const MODAL_POSITIONS = {
    center: { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
    top: { top: "0%", left: "50%", transform: "translateX(-50%)" },
    left: { top: "50%", left: "0%", transform: "translateY(-50%)" },
    right: { top: "50%", left: "90%", transform: "translate(-100%, -50%)" },
    "top-left": { top: "0%", left: "0%", transform: "none" },
    "top-right": { top: "0%", left: "90%", transform: "translateX(-100%)" },
    "bottom-left": { top: "90%", left: "0%", transform: "translateY(-100%)" },
    "bottom-right": { top: "90%", left: "90%", transform: "translate(-100%, -100%)" },
} as const;

type SizeKey = keyof typeof MODAL_SIZES;
type PosKey = keyof typeof MODAL_POSITIONS;

type ModalConfig = {
    open: boolean;
    width: string;
    height: string;
    top: string;
    left: string;
    transform: string;
};

export default function BuilderModal() {
    const [config, setConfig] = useState<ModalConfig>({
        open: false,
        ...MODAL_SIZES.medium,
        ...MODAL_POSITIONS.center,
    });


    const openModal = (size: SizeKey, position: PosKey) => {
        setConfig({
            open: true,
            ...MODAL_SIZES[size],
            ...MODAL_POSITIONS[position],
        });
    };

    const closeModal = () => setConfig((prev) => ({ ...prev, open: false }));

    const btnBase = { width: 170, height: 40 };

    const buttonGroups = [
        {
            title: "Small",
            color: "primary",
            size: "small" as SizeKey,
            variants: [
                { pos: "center", label: "کوچک مرکز" },
                { pos: "top-left", label: "کوچک بالا-چپ" },
                { pos: "top-right", label: "کوچک بالا-راست" },
                { pos: "bottom-left", label: "کوچک پایین-چپ" },
                { pos: "bottom-right", label: "کوچک پایین-راست" },
            ],
        },
        {
            title: "Medium",
            color: "success",
            size: "medium" as SizeKey,
            variants: [
                { pos: "center", label: "متوسط - مرکز" },
                { pos: "left", label: "متوسط - چپ" },
                { pos: "right", label: "متوسط - راست" },
                { pos: "top", label: "متوسط - بالا" },
            ],
        },
        {
            title: "Large",
            color: "error",
            size: "large" as SizeKey,
            variants: [
                { pos: "center", label: "بزرگ مرکز" },
                { pos: "top", label: "بزرگ بالا" },
            ],
        },
    ];

    return (
        <div className="w-full flex flex-col overflow-hidden p-4">
            <div className="flex flex-col bg-white rounded-xl md:h-full max-h-screen">
                <div className="flex flex-col p-4 gap-6">

                    {buttonGroups.map((group, idx) => (
                        <div key={idx} className="flex gap-4 flex-wrap">
                            {group.variants.map((v, i) => (
                                <Button
                                    key={i}
                                    variant={group.color === "error" ? "outlined" : "contained"}
                                    color={group.color as any}
                                    sx={btnBase}
                                    onClick={() => openModal(group.size, v.pos as PosKey)}
                                >
                                    {v.label}
                                </Button>
                            ))}
                        </div>
                    ))}

                </div>

                <Dialog
                    open={config.open}
                    onClose={closeModal}
                    PaperProps={{
                        sx: {
                            width: config.width,
                            height: config.height,
                            maxWidth: "none",
                            position: "absolute",
                            top: config.top,
                            left: config.left,
                            transform: config.transform,
                            overflow: "hidden",
                            borderRadius: 3,
                        },
                    }}
                >
                    <Box sx={{ width: "100%", height: "100%" }}>
                        <iframe
                            src="https://newpl1psya.qhami.com/form/survey-d65d4a14-cc29-407f-843d-32cccb0c3983?refID=null"
                            style={{ width: "100%", height: "100%", border: "none" }}
                            title="Builder"
                            allowFullScreen
                        />
                    </Box>
                </Dialog>

            </div>
        </div>
    );
}
