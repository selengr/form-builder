"use client";

import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";

import Color from "@tiptap/extension-color";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";

import {
  LuUndo2,
  LuRedo2,
  LuChevronDown,
  LuBold,
  LuItalic,
  LuUnderline,
  LuCode,
  LuAlignLeft,
  LuAlignCenter,
  LuAlignRight,
  LuAlignJustify,
  LuPalette,
} from "react-icons/lu";

import { Variable } from "./Variable";
import { FontSize } from "./fontSize";
import { IConditionQuestionType } from "@/types/condition";

type Item = { caption: string; unique_name: string };

type Props = {
  label?: string;
  qacWithOutFilter: IConditionQuestionType[];
  initialHTML?: string;
  onChange?: (data: {
    html: string;
    json: any;
    text: string;
    variables: { unique_name: string; label: string }[];
  }) => void;
  dir?: "rtl" | "ltr";
  disabled?: boolean;
};

const TOOL_BTN =
  "inline-flex items-center justify-center h-8 w-8 rounded-md border border-[#DDE1E6] " +
  "hover:bg-gray-50 active:scale-[0.98] transition disabled:opacity-40 disabled:cursor-not-allowed";

const TOOL_BTN_ACTIVE = "bg-[#E8EEF8] border-[#1758BA] text-[#1758BA]";
const TOOL_BTN_INACTIVE = "text-gray-700";

const GROUP =
  "inline-flex items-center rounded-md border border-[#DDE1E6] overflow-hidden";

const GROUP_BTN =
  "inline-flex items-center justify-center h-8 w-8 hover:bg-gray-50 transition " +
  "data-[active=true]:bg-[#E8EEF8] data-[active=true]:text-[#1758BA]";

function preventFocusSteal(e: React.MouseEvent) {
  e.preventDefault();
}

export default function AdvancedEditor({
  label,
  qacWithOutFilter,
  initialHTML = "",
  onChange,
  dir = "rtl",
  disabled = false,
}: Props) {
  const sizes = useMemo(() => ["12px", "14px", "16px", "18px", "24px",
    "32px"], []);
  const colorRef = useRef<HTMLInputElement>(null);

  const variableItems = useMemo(
    () => qacWithOutFilter?.map((x) => ({ unique_name: x.extMap.UNIC_NAME, caption: x.caption })),
    [qacWithOutFilter],
  );

  const [, force] = useState(0);
  const forceUpdate = useCallback(() => force((x) => x + 1), []);

  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    extensions: [
      Variable.configure({ items: variableItems }),
      StarterKit,
      TextStyle,
      Color,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      FontSize,
    ],
    content: initialHTML,
    editorProps: {
      attributes: {
        dir,
        class:
          "min-h-[110px] w-full rounded-[10px] border border-[#DDE1E6] px-4 py-2 " +
          "leading-[2.2] focus:outline-none focus:ring-1 focus:ring-[#1758BA]/20",
        style: "font-family: IranSans, Roboto, Arial, sans-serif;",
      },
    },
    onUpdate: ({ editor }) => {
      if (!onChange) return;

      const html = editor.getHTML();
      const text = editor.getText();
      const json = editor.getJSON();

      const variables: { unique_name: string; label: string }[] = [];
      const walk = (n: any) => {
        if (!n) return;
        if (n.type === "variable") {
          variables.push({
            unique_name: n.attrs?.unique_name ?? "",
            label: n.attrs?.label ?? "",
          });
        }
        n.content?.forEach(walk);
      };
      walk(json);

      onChange({ html, json, text, variables });
    },
  });

  useEffect(() => {
    if (!editor) return;

    const update = () => forceUpdate();

    editor.on("selectionUpdate", update);
    editor.on("transaction", update);

    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
    };
  }, [editor, forceUpdate]);

  if (!editor) return null;

  const currentColor = editor.getAttributes("textStyle")?.color || "#111827";

  return (
    <div className="w-full max-w-[988px] text-gray-950">



      <div className="flex flex-col w-full">
        <div className="flex flex-row w-full justify-between">
          {label ? <span className="text-[#393939] text-sm mb-1 flex items-end justify-end md:mr-20 pr-2">{label}</span> : null}
          <div dir="ltr" className="flex flex-wrap gap-2 items-center flerse mb-2">
            {/* Undo/Redo */}
            <div className={GROUP}>
              <button
                type="button"
                onMouseDown={preventFocusSteal}
                onClick={() => editor.chain().focus().undo().run()}
                disabled={disabled || !editor.can().undo()}
                className={GROUP_BTN}
                title="Undo"
                aria-label="Undo"
              >
                <LuUndo2 size={16} />
              </button>
              <button
                type="button"
                onMouseDown={preventFocusSteal}
                onClick={() => editor.chain().focus().redo().run()}
                disabled={disabled || !editor.can().redo()}
                className={GROUP_BTN}
                title="Redo"
                aria-label="Redo"
              >
                <LuRedo2 size={16} />
              </button>
            </div>

            <div className="relative inline-flex items-center">
              <select
                className="
h-8 pl-3 pr-8 text-sm cursor-pointer
rounded-md border border-[#DDE1E6] bg-white text-gray-900
focus:outline-none focus:ring-2 focus:ring-[#1758BA]/30 focus:border-[#1758BA]
appearance-none disabled:opacity-40 disabled:cursor-not-allowed
"
                defaultValue=""
                disabled={disabled}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v) editor.chain().focus().setFontSize(v).run();
                }}
                aria-label="Font size"
                title="Font size"
              >
                <option value="">Size</option>
                {sizes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <LuChevronDown size={16} className="pointer-events-none absolute right-2
text-gray-500" />
            </div>

            {/* Color */}
            <div className="inline-flex items-center">
              <button
                type="button"
                onMouseDown={preventFocusSteal}
                onClick={() => colorRef.current?.click()}
                disabled={disabled}
                className={`${TOOL_BTN} ${TOOL_BTN_INACTIVE}`}
                title="Text color"
                aria-label="Text color"
              >
                <LuPalette size={20} />
              </button>
              <input
                ref={colorRef}
                type="color"
                value={currentColor}
                onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                className="sr-only"
                disabled={disabled}
                aria-label="Pick text color"
              />
            </div>

            {/* Align */}
            <div className={GROUP}>
              <button type="button" className={GROUP_BTN}
                data-active={editor.isActive({ textAlign: "left" })}
                onMouseDown={preventFocusSteal} onClick={() =>
                  editor.chain().focus().setTextAlign("left").run()} disabled={disabled}
                title="Align left" aria-label="Align left">
                <LuAlignLeft size={16} />
              </button>
              <button type="button" className={GROUP_BTN}
                data-active={editor.isActive({ textAlign: "center" })}
                onMouseDown={preventFocusSteal} onClick={() =>
                  editor.chain().focus().setTextAlign("center").run()}
                disabled={disabled} title="Align center" aria-label="Align center">
                <LuAlignCenter size={16} />
              </button>
              <button type="button" className={GROUP_BTN}
                data-active={editor.isActive({ textAlign: "right" })}
                onMouseDown={preventFocusSteal} onClick={() =>
                  editor.chain().focus().setTextAlign("right").run()}
                disabled={disabled} title="Align right" aria-label="Align right">
                <LuAlignRight size={16} />
              </button>
              <button type="button" className={GROUP_BTN}
                data-active={editor.isActive({ textAlign: "justify" })}
                onMouseDown={preventFocusSteal} onClick={() =>
                  editor.chain().focus().setTextAlign("justify").run()}
                disabled={disabled} title="Justify" aria-label="Justify">
                <LuAlignJustify size={16} />
              </button>
            </div>

            {/* Marks */}
            <div className="flex items-center gap-2">
              <button type="button" onMouseDown={preventFocusSteal} onClick={() =>
                editor.chain().focus().toggleBold().run()} disabled={disabled}
                className={`${TOOL_BTN} ${editor.isActive("bold") ? TOOL_BTN_ACTIVE :
                  TOOL_BTN_INACTIVE}`} title="Bold" aria-label="Bold">
                <LuBold size={16} />
              </button>

              <button type="button" onMouseDown={preventFocusSteal} onClick={() =>
                editor.chain().focus().toggleItalic().run()} disabled={disabled}
                className={`${TOOL_BTN} ${editor.isActive("italic") ? TOOL_BTN_ACTIVE
                  : TOOL_BTN_INACTIVE}`} title="Italic" aria-label="Italic">
                <LuItalic size={16} />
              </button>

              <button type="button" onMouseDown={preventFocusSteal} onClick={() =>
                editor.chain().focus().toggleUnderline().run()} disabled={disabled}
                className={`${TOOL_BTN} ${editor.isActive("underline") ?
                  TOOL_BTN_ACTIVE : TOOL_BTN_INACTIVE}`} title="Underline"
                aria-label="Underline">
                <LuUnderline size={16} />
              </button>

              <button type="button" onMouseDown={preventFocusSteal} onClick={() =>
                editor.chain().focus().toggleCode().run()} disabled={disabled}
                className={`${TOOL_BTN} ${editor.isActive("code") ? TOOL_BTN_ACTIVE :
                  TOOL_BTN_INACTIVE}`} title="Inline code" aria-label="Inline code">
                <LuCode size={16} />
              </button>
            </div>
          </div>

        </div>


        <div className='flex flex-row w-full'>
          <button
            type="button"
            onMouseDown={preventFocusSteal}
            onClick={() => editor.chain().focus().insertVariable().run()}
            disabled={disabled}
            className="h-8 w-24 m-2 -mr-3 mt-0 rounded-md border-none text-xs
hover:opacity-80 transition disabled:opacity-40
disabled:cursor-not-allowed text-[#1758BA] bg-[#E8EEF8] font-medium"
          >
            افزودن متغیر
          </button>

          <EditorContent editor={editor} className="w-full" />

        </div>

      </div>
    </div>
  );
}

