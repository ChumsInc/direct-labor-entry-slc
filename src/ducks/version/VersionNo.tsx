import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {selectVersionNo} from "./selectors";
import {loadVersion} from "./actions";

const VersionNo = () => {
    const dispatch = useAppDispatch();
    const versionNo = useAppSelector(selectVersionNo);

    useEffect(() => {
        dispatch(loadVersion())
    }, []);

    return (
        <span>Version: {versionNo ?? 'loading'}</span>
    )
}

export default VersionNo;
