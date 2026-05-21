import {type ReactNode, useCallback, useEffect, useMemo, useState} from "react";
import isEqual from 'fast-deep-equal';
import EditorContext, {type EditorContextData} from "@/hooks/editor/EditorContext.tsx";


export interface EditorProviderProps<T = unknown> {
    initialValue: T;
    children: ReactNode;
}

interface EditorState<T> {
    value: T;
    changed: boolean;
}
export default function EditorProvider<T>({initialValue, children}: EditorProviderProps<T>) {
    const [state, setState] = useState<EditorState<T>>({value: initialValue, changed:false});

    useEffect(() => {
        const reset = () => {
            setState({value: initialValue, changed:false});
        }
        reset();
    }, [initialValue]);

    const updateValue = useCallback((arg: Partial<T>) => {
        setState(prev => {
            const value = {...prev.value, ...arg};
            const changed = !isEqual(initialValue, value);
            return {value, changed};
        });
    }, [initialValue])

    const reset = useCallback(() => setState({value: initialValue, changed: false}), [initialValue]);

    const contextValue = useMemo<EditorContextData<T>>(
        () => ({
            ...state,
            updateValue,
            reset,
        }),
        [state, updateValue, reset],
    )

    return (
        <EditorContext value={contextValue as unknown as EditorContextData}>
            {children}
        </EditorContext>
    )
}
