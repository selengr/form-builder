"use client";
import Image from "next/image";
import { useState } from "react";

type EmojiItem = {
    id: number;
    label: string;
    url: string;

};

type EmojiRatingProps = {
    value?: number;
    onChange?: (value: number) => void;
    clickableEmojis?: boolean;
    startValue?: string
    endValue?: string
};


const EMOJIS: EmojiItem[] = [
    {
        id: 1,
        label: "Very bad",
        url: "angry.svg",
    },
    {
        id: 2,
        label: "Bad",
        url: "neutral.svg",
    },
    {
        id: 3,
        label: "Okay",
        url: "happy.svg",
    },
    {
        id: 4,
        label: "Good",
        url: "sad.svg",

    },
    {
        id: 5,
        label: "Great",
        url: "laugh.svg",
    },
]

const renderLable = (value: string) => {
    return (
        <p className="mx-1 text-md font-medium transition-colors">
            {value}
        </p>
    )
};

export default function EmojiRating({
    value: controlledValue,
    onChange,
    clickableEmojis = false,
    startValue,
    endValue
}: EmojiRatingProps) {
    const [internalValue, setInternalValue] = useState(0);
    const [popIndex, setPopIndex] = useState<number | null>(null);

    const value = controlledValue ?? internalValue;

    return (
        <div dir="ltr" className="w-full flex flex-row items-center justify-center
gap-2 select-none">
            <span className="md:flex hidden justify-between mt-2">
                {startValue && renderLable(startValue)}
            </span>
            <div className="flex flex-col">
                <div className="flex justify-between w-full x-2 gap-4">
                    {EMOJIS.map((emoji) => {
                        const isActive = emoji.id === value;
                        const isPopping = emoji.id === popIndex;

                        return (
                            <div
                                key={emoji.id}
                                className={`flex flex-col items-center gap-4 ${clickableEmojis ? "cursor-pointer" : ""
                                    }`}
                                onClick={() => {
                                    if (!clickableEmojis) return;
                                    setInternalValue(emoji.id);
                                    onChange?.(emoji.id);
                                    setPopIndex(emoji.id);
                                    setTimeout(() => setPopIndex(null), 180);
                                }}
                            >
                                <div
                                    className={`relative w-14 h-14 ${isPopping ? "emoji-pop" : ""}`}
                                >
                                    <Image
                                        src={`/images/icons/rating/${emoji.url}`}
                                        alt={emoji.label}
                                        fill
                                        quality={100}
                                        priority={true}
                                        sizes="56px"
                                        className="object-contain transition-all duration-200"
                                        style={{
                                            filter: isActive
                                                ? "drop-shadow(0 0 6px rgba(255, 225, 62, 0.6))"
                                                : "grayscale(100%) brightness(0.99)",
                                        }}
                                    />

                                    {isActive && (
                                        <div className="absolute inset-0 emoji-sweep pointer-events-none" />
                                    )}
                                </div>
                            </div>
                        );
                    })}

                </div>


                <RangeSlider
                    value={value}
                    max={EMOJIS.length}
                    onChange={(v) => {
                        setInternalValue(v);
                        onChange?.(v);
                        setPopIndex(v);
                        setTimeout(() => setPopIndex(null), 180);
                    }}
                />
                <div className="w-full flex md:hidden justify-between mt-2">
                    {startValue && renderLable(startValue)}
                    {endValue && renderLable(endValue)}
                </div>
            </div>
            <span className="md:flex hidden justify-between mt-2">
                {endValue && renderLable(endValue)}
            </span>
            <style jsx>{`
@keyframes pop {
0% {
transform: scale(1);
}
70% {
transform: scale(1.35);
}
100% {
transform: scale(1);
}
}

.emoji-pop {
animation: pop 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes sweep {
0% {
transform: translateX(-40%);
background: linear-gradient(
120deg,
transparent,
rgba(255, 255, 255, 0.7),
transparent
);
}
100% {
transform: translateX(100%);
background: linear-gradient(
120deg,
transparent,
rgba(255, 255, 255, 0),
transparent
);
}
}

.emoji-sweep {
animation: sweep 0.4s ease-out;
}
`}</style>
        </div>
    );
}

type RangeSliderProps = {
    value: number;
    max: number;
    onChange: (value: number) => void;
};

export function RangeSlider({ value, max, onChange }: RangeSliderProps) {
    let percent
    if (value === 0) {
        percent = 0;
    } else if (value === 1) {
        percent = (0.35 / max) * 100;
    } else if (value === 2) {   
        percent = (1.4 / max) * 100;
    } else if (value === 3) {
        percent = (2.49 / max) * 100;
    } else if (value === 4) {
        percent = (3.55 / max) * 100;
    } else if (value === 5) {
        percent = (value / max) * 100;
    }


    const handleChangeRange = (e: any) => {
        onChange(Number(e.target.value))
    }

    return (
        <div className="w-full relative mt-3">
            <div className="h-2 rounded-full bg-[#EBEBEB] relative">
                <div
                    className="absolute left-0 top-0 h-full rounded-full"
                    style={{
                        width: `${percent}%`,
                        background: "linear-gradient(90deg, #D74425 0%, #FFE950 140.35%)",
                    }}
                />

                <div
                    className="absolute top-1/2 -translate-y-1/2"
                    style={{
                        left: `calc(${percent}% - 6px)`,
                        width: 14,
                        height: 14,
                        background: "#FFFFFF",
                        border: "1px solid #EBEBEB",
                        borderRadius: "50%",
                        boxShadow: "0px 2px 6px 0px #0000001A",
                        opacity: 1,
                        pointerEvents: "none",
                    }}
                />
            </div>


            <input
                type="range"
                min={0}
                max={max}
                step={1}
                value={value}
                onChange={handleChangeRange}
                className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
            />

            <div className="flex justify-between mt-3 px-5">
                {Array.from({ length: max }).map((_, i) => (
                    <div
                        key={i}
                        className="w-2 h-2 rounded-full transition-colors"
                        style={{
                            backgroundColor: i + 1 === value ? "#FFE13E" : "#D1D5DB",
                        }}
                    />
                ))}
            </div>
        </div>
    );
}