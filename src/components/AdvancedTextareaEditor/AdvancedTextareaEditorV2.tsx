"use client";

import React, { useMemo, useRef, useState, useEffect, useCallback }
from "react";
import { useEditor, EditorContent } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";

import {
Undo2,
Redo2,
ChevronDown,
Bold,
Italic,
Underline as UnderlineIcon,
Code2,
AlignLeft,
AlignCenter,
AlignRight,
AlignJustify,
Palette,
} from "lucide-react";

import { Variable } from "@/components/RichTextEditor/Variable";
import { FontSize } from "@/components/RichTextEditor/FontSize";

type Item = { caption: string; unique_name: string };

type Props = {
label?: string;
items: Item[];
initialHTML?: string;
onChange?: (data: {
html: string;
text: string;
variables: { unique_name: string; label: string }[];
}) => void;
dir?: "rtl" | "ltr";
disabled?: boolean;
};

const TOOL_BTN =
"inline-flex items-center justify-center h-8 w-8 rounded-md border
border-[#DDE1E6] " +
"hover:bg-gray-50 active:scale-[0.98] transition disabled:opacity-40
disabled:cursor-not-allowed";

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
items,
initialHTML = "",
onChange,
dir = "rtl",
disabled = false,
}: Props) {
const sizes = useMemo(() => ["12px", "14px", "16px", "18px", "24px",
"32px"], []);
const colorRef = useRef<HTMLInputElement>(null);

const variableItems = useMemo(
() => items.map((x) => ({ unique_name: x.unique_name, caption: x.caption })),
[items],
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
"leading-[2.2] focus:outline-none focus:ring-2 focus:ring-[#1758BA]/20",
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

onChange({ html, text, variables });
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
{label ? <div className="text-sm mb-2">{label}</div> : null}

<div className="flex flex-wrap gap-2 items-center mb-2">
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
<Undo2 size={16} />
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
<Redo2 size={16} />
</button>
</div>

{/* Variable */}
<button
type="button"
onMouseDown={preventFocusSteal}
onClick={() => editor.chain().focus().insertVariable().run()}
disabled={disabled}
className="h-8 px-3 rounded-md border border-[#DDE1E6]
hover:bg-gray-50 transition disabled:opacity-40
disabled:cursor-not-allowed"
>
افزودن متغیر
</button>

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
<ChevronDown size={16} className="pointer-events-none absolute right-2
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
<Palette size={20} />
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



{/* Marks */}
<div className="flex items-center gap-2">
<button type="button" onMouseDown={preventFocusSteal} onClick={() =>
editor.chain().focus().toggleBold().run()} disabled={disabled}
className={`${TOOL_BTN} ${editor.isActive("bold") ? TOOL_BTN_ACTIVE :
TOOL_BTN_INACTIVE}`} title="Bold" aria-label="Bold">
<Bold size={16} />
</button>

<button type="button" onMouseDown={preventFocusSteal} onClick={() =>
editor.chain().focus().toggleItalic().run()} disabled={disabled}
className={`${TOOL_BTN} ${editor.isActive("italic") ? TOOL_BTN_ACTIVE
: TOOL_BTN_INACTIVE}`} title="Italic" aria-label="Italic">
<Italic size={16} />
</button>

<button type="button" onMouseDown={preventFocusSteal} onClick={() =>
editor.chain().focus().toggleUnderline().run()} disabled={disabled}
className={`${TOOL_BTN} ${editor.isActive("underline") ?
TOOL_BTN_ACTIVE : TOOL_BTN_INACTIVE}`} title="Underline"
aria-label="Underline">
<UnderlineIcon size={16} />
</button>

<button type="button" onMouseDown={preventFocusSteal} onClick={() =>
editor.chain().focus().toggleCode().run()} disabled={disabled}
className={`${TOOL_BTN} ${editor.isActive("code") ? TOOL_BTN_ACTIVE :
TOOL_BTN_INACTIVE}`} title="Inline code" aria-label="Inline code">
<Code2 size={16} />
</button>
</div>
</div>

<EditorContent editor={editor} />
</div>
);
}

