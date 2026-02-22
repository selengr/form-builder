
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
