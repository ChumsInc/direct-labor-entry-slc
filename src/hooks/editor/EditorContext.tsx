import {createContext} from "react";

export interface EditorContextData<T = unknown> {
    value: T;
    updateValue: (arg: Partial<T>) => void;
    reset: () => void;
    changed: boolean;
}

const EditorContext = createContext<EditorContextData|null>(null);
export default EditorContext;
