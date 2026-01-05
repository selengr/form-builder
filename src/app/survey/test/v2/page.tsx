'use client';

import { useState } from "react";
import {Button } from "@mui/material";
import SurveyModal, { SurveyModalSize } from "@/components/survey/SurveyModal";


export default function Page() {
    const [open, setOpen] = useState(false)
    const [size, setSize] = useState<SurveyModalSize>("medium")

    const defaultUrl =
        "https://newpl1psya.qhami.com/form/survey-d65d4a14-cc29-407f-843d-32cccb0c3983?survey=PSYA";

    const openModal = (s: SurveyModalSize) => {
        setSize(s)
        setOpen(true)
    }

    const buttonGroups = [
        {
            title: "Small Size",
            size: "small" as SurveyModalSize,
            variants: [
                { pos: "center", label: "Small Center" },
                { pos: "top-left", label: "Small Top-Left" },
                { pos: "top-right", label: "Small Top-Right" },
                { pos: "bottom-left", label: "Small Bottom-Left" },
                { pos: "bottom-right", label: "Small Bottom-Right" },
            ],
        },
        {
            title: "Medium Size",
            size: "medium" as SurveyModalSize,
            variants: [
                { pos: "center", label: "Medium Center" },
                { pos: "left", label: "Medium Left" },
                { pos: "right", label: "Medium Right" },
                { pos: "top", label: "Medium Top" },
            ],
        },
        {
            title: "Large Size",
            size: "large" as SurveyModalSize,
            variants: [
                { pos: "center", label: "Large Center" },
                { pos: "top", label: "Large Top" },
            ],
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
            <div className="mx-auto max-w-6xl space-y-8">

                <div className="grid gap-6 md:grid-cols-3">
                    {buttonGroups.map((group, idx) => (
                        <div key={idx}>
                            <div className="space-y-2">
                                {group.variants.map((v, i) => (
                                    <Button
                                        key={i}
                                        // variant={group.size}
                                        className="w-full"
                                        onClick={() => openModal(group.size)}
                                    >
                                        {v.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>


                <SurveyModal
                    open={open}
                    onClose={() => setOpen(false)}
                    surveyUrl={defaultUrl}
                    size={size}
                />
            </div>
        </div>
    )
}
