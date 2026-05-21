import EditorContext, {type EditorContextData} from "@/hooks/editor/EditorContext.tsx";
import {useContext} from "react";

export function useEditorContext<T = unknown>(): EditorContextData<T> {
    const context = useContext(EditorContext) as EditorContextData<T> | null;
    if (!context) {
        throw new Error("useEditorContext must be used within an EditorProvider");
    }
    return context;
}
