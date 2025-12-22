"use client";

import { useState, useRef } from "react";

const GOLD = "#DFB300";
const EMPTY = "#D9D9D9";

export type RatingProps = {
    max?: number;
    precision?: number;
    animateFill?: boolean;
    value?: number;
    onChange?: (value: number) => void;
    readOnly?: boolean;
    labels?: string[];
    icon?: React.ReactNode;
    heart?: boolean;
    iconSize?: number;
};

export default function StarRating({
    max = 5,
    precision = 0.5,
    animateFill = true,
    value: controlledValue,
    onChange,
    readOnly = false,
    labels = [],
    icon,
    heart = false,
    iconSize = 56,
}: RatingProps) {
    const [internalValue, setInternalValue] = useState(0);
    const [hoverValue, setHoverValue] = useState<number | null>(null);
    const [popIndex, setPopIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const color = heart ? "red" : GOLD;

    const value = controlledValue ?? internalValue;
    const displayValue = hoverValue ?? value;

    const handleSelect = (index: number, percent: number) => {
        if (readOnly) return;
        const rawValue = index + percent;
        const rounded = Math.round(rawValue / precision) * precision;
        setInternalValue(rounded);
        onChange?.(rounded);

        setPopIndex(index);
        setTimeout(() => setPopIndex(null), 180);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (readOnly) return;
        e.preventDefault();

        let nextValue = value ?? 0;

        if (e.key === "ArrowRight" || e.key === "ArrowUp")
            nextValue = Math.min(nextValue + precision, max);
        else if (e.key === "ArrowLeft" || e.key === "ArrowDown")
            nextValue = Math.max(nextValue - precision, 0);
        else if (e.key === "Home") nextValue = 0;
        else if (e.key === "End") nextValue = max;

        setInternalValue(nextValue);
        onChange?.(nextValue);

        const index = Math.floor(nextValue) - 1;
        if (index >= 0) {
            setPopIndex(index);
            setTimeout(() => setPopIndex(null), 180);
        }
    };

    const renderIcon = (color: string, fillPercent: number) => {
        if (heart)
            return (
                <svg
                    viewBox="0 0 24 24"
                    className="h-14 w-14"
                    fill={color === "#D9D9D9" ? "none" : "red"}
                    stroke="#D9D9D9"
                    strokeWidth="2"
                >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4 8.24 4 9.91 4.81 11 6.09 12.09 4.81 13.76 4 15.5 4 18 4 20 6 20 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
            );
        return (
            <svg
                viewBox="0 0 24 24"
                className="h-14 w-14"
                fill={color}
                style={{
                    filter: fillPercent > 0 ? `drop-shadow(0 0 4px ${GOLD})` : undefined,
                }}
            >
                <path d="M12 17.3l6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.76-1.64 7.03L12 17.3z" />{" "}
            </svg>
        );
    };

    return (
        <div
            ref={containerRef}
            tabIndex={readOnly ? -1 : 0}
            onKeyDown={handleKeyDown}
            role="slider"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
            aria-label="Rating"
            className="flex flex-col items-center gap-2 focus:outline-none select-none"
        >
            <p
                className="text-sm font-medium transition-colors"
                style={{ color: displayValue ? color : EMPTY }}
            >
                {!readOnly
                    ? hoverValue !== null
                        ? `Rate: ${hoverValue.toFixed(precision === 1 ? 0 : 1)}`
                        : value
                            ? `Your rating: ${value.toFixed(precision === 1 ? 0 : 1)}`
                            : "Tap to rate"
                    : value
                        ? `Rating: ${value.toFixed(precision === 1 ? 0 : 1)}`
                        : ""}
            </p>

            <div className="flex gap-1 relative">
                {Array.from({ length: max }).map((_, i) => {
                    const fillPercent = Math.min(Math.max(displayValue - i, 0), 1) * 100;
                    const label = labels[i] ?? "";
                    const isPopping = i === popIndex;

                    return (
                        <div
                            key={i}
                            className={`relative cursor-pointer mx-1  ${readOnly ? "cursor-default" : ""
                                } group`}
                            style={{ width: iconSize, height: iconSize }}
                            onMouseMove={(e) => {
                                if (readOnly) return;
                                const rect = e.currentTarget.getBoundingClientRect();
                                const percent = (e.clientX - rect.left) / rect.width;
                                setHoverValue(
                                    Math.round((i + percent) / precision) * precision
                                );
                            }}
                            onMouseLeave={() => !readOnly && setHoverValue(null)}
                            onClick={(e) => {
                                if (readOnly) return;
                                const rect = e.currentTarget.getBoundingClientRect();
                                const percent = (e.clientX - rect.left) / rect.width;
                                handleSelect(i, percent);
                            }}
                            aria-label={`Rate ${i + 1}`}
                        >
                            <div className={isPopping ? "animate-pop" : ""}>
                                {renderIcon(EMPTY, fillPercent)}

                                <div
                                    className={`absolute inset-0 overflow-hidden pointer-events-none ${animateFill ? "transition-all duration-100 ease-in-out" : ""
                                        }`}
                                    style={{ width: `${fillPercent}%`, height: "100%" }}
                                >
                                    {renderIcon(GOLD, fillPercent)}
                                </div>
                            </div>

                            {label && !readOnly && (
                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-gray-700 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    {label}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            <style jsx>{`
        @keyframes pop {
          0% {
            transform: scale(1);
            opacity: 0.3;
            filter: drop-shadow(0 0 2px ${color});
          }
          80% {
            transform: scale(1.35);
            opacity: 0.8;
            filter: drop-shadow(0 0 8px ${color});
          }
          100% {
            transform: scale(1);
            opacity: 0;
            filter: drop-shadow(0 0 2px transparent);
          }
        }
        .animate-pop {
          animation: pop 0.1s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: center center;
          position: relative;
          z-index: 1;
        }
      `}</style>
        </div>
    );
}