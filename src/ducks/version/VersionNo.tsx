import React, {useEffect, useRef} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectVersionNo} from "./index";
import {loadVersion} from "./actions";

const VersionNo = () => {
    const dispatch = useAppDispatch();
    const versionNo = useAppSelector(selectVersionNo);
    const timerRef = useRef<number>(0);

    useEffect(() => {
        loadHandler()
        timerRef.current = window.setInterval(loadHandler, 1000 * 60 * 60)
        return () => {
            clearTimeout(timerRef.current);
        }
    }, []);

    const loadHandler = () => {
        dispatch(loadVersion());
    }
    return (
        <span onClick={loadHandler}>Version: {versionNo ?? 'loading'}</span>
    )
}

export default VersionNo;
