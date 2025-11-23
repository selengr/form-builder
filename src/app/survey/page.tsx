"use client";

import { useState } from "react";
import { Dialog, Button, Box } from "@mui/material";

/** Predefined modal sizes */
const MODAL_SIZES = {
    small: { width: "400px", height: "400px" },
    medium: { width: "600px", height: "500px" },
    large: { width: "800px", height: "600px" },
    full: { width: "100%", height: "100%" },
};

/** Predefined modal positions */
const MODAL_POSITIONS = {
    center: { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
    top: { top: "0%", left: "50%", transform: "translateX(-50%)" },
    left: { top: "50%", left: "0%", transform: "translateY(-50%)" },
    right: { top: "50%", left: "90%", transform: "translate(-100%, -50%)" },
    "top-left": { top: "0%", left: "0%", transform: "none" },
    "top-right": { top: "0%", left: "90%", transform: "translateX(-100%)" },
    "bottom-left": { top: "90%", left: "0%", transform: "translateY(-100%)" },
    "bottom-right": { top: "90%", left: "90%", transform: "translate(-100%, -100%)" },
};

export default function BuilderModal() {
    const [config, setConfig] = useState({
        open: false,
        width: "600px",
        height: "500px",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
    });

    const openModal = (sizeKey: keyof typeof MODAL_SIZES, posKey: keyof typeof MODAL_POSITIONS) => {
        const size = MODAL_SIZES[sizeKey];
        const position = MODAL_POSITIONS[posKey];

        setConfig({
            open: true,
            ...size,
            ...position,
        });
    };

    const closeModal = () => setConfig({ ...config, open: false });

    return (
        <div className="w-full flex flex-col overflow-hidden p-4">
            <div className="flex flex-col bg-white rounded-xl md:h-full max-h-screen">
                <div className="flex gap-4 p-4 flex-wrap">

                    <div className="flex gap-4 p-4 flex-wrap">
                        <Button variant="contained" sx={{ width: 170, height: 40 }} onClick={() => openModal("small", "center")}>
                            کوچک مرکز
                        </Button>
                        <Button variant="contained" sx={{ width: 170, height: 40 }} onClick={() => openModal("small", "top-left")}>
                            کوچک بالا-چپ
                        </Button>
                        <Button variant="contained" sx={{ width: 170, height: 40 }} onClick={() => openModal("small", "top-right")}>
                            کوچک بالا-راست
                        </Button>
                        <Button variant="contained" sx={{ width: 170, height: 40 }} onClick={() => openModal("small", "bottom-left")}>
                            کوچک پایین-چپ
                        </Button>
                        <Button variant="contained" sx={{ width: 170, height: 40 }} onClick={() => openModal("small", "bottom-right")}>
                            کوچک پایین-راست
                        </Button>
                    </div>

                    <div className="flex gap-4 p-4 flex-wrap">
                        <Button color="success" variant="contained" sx={{ width: 170, height: 40 }} onClick={() => openModal("medium", "center")}>
                            متوسط - مرکز
                        </Button>
                        <Button color="success" variant="contained" sx={{ width: 170, height: 40 }} onClick={() => openModal("medium", "left")}>
                            متوسط - چپ
                        </Button>
                        <Button color="success" variant="contained" sx={{ width: 170, height: 40 }} onClick={() => openModal("medium", "right")}>
                            متوسط - راست
                        </Button>
                        <Button color="success" variant="contained" sx={{ width: 170, height: 40 }} onClick={() => openModal("medium", "top")}>
                            متوسط - بالا
                        </Button>
                    </div>

                    <div className="flex gap-4 p-4 flex-wrap">
                        <Button color="error" variant="outlined" sx={{ width: 170, height: 40 }} onClick={() => openModal("large", "center")}>
                            بزرگ مرکز
                        </Button>
                        <Button color="error" variant="outlined" sx={{ width: 170, height: 40 }} onClick={() => openModal("large", "top")}>
                            بزرگ بالا
                        </Button>
                    </div>

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
                            src="http://mbz2.ir/form/5128?survey=PSYA"
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
