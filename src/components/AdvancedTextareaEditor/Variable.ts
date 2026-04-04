
import VariableNodeView from "./VariableNodeView";
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

type Item = { unique_name: string; caption: string };

export const Variable = Node.create({
    name: "variable",

    group: "inline",
    inline: true,
    atom: true,
    selectable: true,

    addOptions() {
        return {
            items: [] as Item[],
        };
    },

    addAttributes() {
        return {
            unique_name: { default: "" },
            label: { default: "" },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'span[data-variable="true"]',
                getAttrs: (el) => {
                    if (!(el instanceof HTMLElement)) return false;
                    return {
                        unique_name: el.getAttribute("data-unique-name") || "",
                        label: el.getAttribute("data-label") || el.textContent || "",
                    };
                },
            },
        ];
    },

    renderHTML({ node, HTMLAttributes }) {
        return [
            "span",
            mergeAttributes(HTMLAttributes, {
                "data-variable": "true",
                "data-unique-name": node.attrs.unique_name || "",
                "data-label": node.attrs.label || "",
                contenteditable: "false",
            }),
            node.attrs.unique_name || "انتخاب کنید",
        ];
    },

    addNodeView() {
        return ReactNodeViewRenderer(VariableNodeView);
    },

    addCommands() {
        return {
            insertVariable:
                () =>
                    ({ commands }) =>
                        commands.insertContent({
                            type: this.name,
                            attrs: { unique_name: "", label: "" },
                        }),
        };
    },
});

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        variable: {
            insertVariable: () => ReturnType;
        };
    }
}
