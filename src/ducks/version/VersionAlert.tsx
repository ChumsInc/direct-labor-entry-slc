import React from 'react';
import {Toast, ToastContainer} from "react-bootstrap";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {dismissNewVersion, selectNextVersionNo} from "@/ducks/version/index";

export default function VersionAlert() {
    const dispatch = useAppDispatch();
    const nextVersion = useAppSelector(selectNextVersionNo);

    const closeHandler = () => {
        dispatch(dismissNewVersion())
    }

    const clickHandler = () => {
        window.location.reload();
    }

    return (
        <ToastContainer position="bottom-start" containerPosition="fixed" className="m-3" >
            <Toast show={!!nextVersion} onClose={closeHandler} className="text-bg-warning">
                <Toast.Header>
                    <strong className="me-auto">New Version Available</strong>
                </Toast.Header>
                <Toast.Body onClick={clickHandler} style={{cursor: 'pointer'}}>
                    Next Version: {nextVersion}; Click to reload.
                </Toast.Body>
            </Toast>
        </ToastContainer>
    )
}
