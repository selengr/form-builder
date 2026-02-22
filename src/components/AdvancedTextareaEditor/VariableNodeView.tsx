"use client";

import React, { useEffect, useRef, useState } from "react";
import { NodeViewWrapper } from "@tiptap/react";
import styles from "./advancedTextareaEditor.module.css";

type Item = { unique_name: string; caption: string };

type Props = {
    node: any;
    updateAttributes: (attrs: Record<string, any>) => void;
    editor: any;
    selected: boolean;
    extension: any;
};

export default function VariableNodeView({ node, updateAttributes,
    editor, selected, extension }: Props) {
    const items: Item[] = (extension?.options?.items ?? []) as Item[];

    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLSpanElement>(null);

    const label = (node.attrs.label as string) || "";
    const unique_name = (node.attrs.unique_name as string) || "";
    const hasValue = Boolean(unique_name);

    useEffect(() => {
        const onDocDown = (e: MouseEvent) => {
            if (!rootRef.current) return;
            if (!rootRef.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", onDocDown);
        return () => document.removeEventListener("mousedown", onDocDown);
    }, []);

    const pick = (it: Item) => {
        updateAttributes({ unique_name: it.unique_name, label: it.caption });
        setOpen(false);
        editor?.commands?.focus();
    };

    return (
        <NodeViewWrapper as="span" data-variable="true" contentEditable={false}>
            <span
                ref={rootRef}
                className="inline-flex justify-center items-center gap-1 bg-white rounded-md p-1"
                onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
            >
                <div
                    className={[styles.dynamicbtn, styles.NEW_FIELD, selected ? "ring-1 ring - [#1758BA]" : ""].join(" ")}
                    contentEditable={false}
                >
                    <div
                        className={styles.customDropdown}
                        data-type={open ? "up" : "down"}
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpen((v) => !v);
                        }}
                        title={hasValue ? unique_name : "انتخاب کنید"}
                    >
                        {hasValue ? label : "انتخاب کنید"}
                    </div>

                    <div
                        className={styles.optionsContainer}
                        style={{ display: open ? "flex" : "none", flexDirection : "column" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {items.map((it) => (
                            <div key={it.unique_name} className={styles.option} onClick={() => pick(it)}>
                                {it.caption}
                            </div>
                        ))}
                    </div>
                </div>
            </span>
        </NodeViewWrapper >
    );
}
