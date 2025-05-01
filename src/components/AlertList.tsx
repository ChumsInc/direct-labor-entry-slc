import React from 'react';
import {useAppDispatch, useAppSelector} from "../app/configureStore";
import {dismissAlert, selectAllAlerts, StyledErrorAlert} from "@chumsinc/alert-list";
import {ContextAlert} from "@chumsinc/react-bootstrap-addons";

const AlertList = () => {
    const dispatch = useAppDispatch();
    const list = useAppSelector(selectAllAlerts);

    const dismissHandler = (alert: StyledErrorAlert) => {
        dispatch(dismissAlert(alert));
    }
    return (
        <div>
            {list.map(alert => (
                <ContextAlert key={alert.id} variant={alert.variant} dismissible
                              onClose={() => dismissHandler(alert)}
                              context={alert.context} count={alert.count}>
                    {alert.message}
                </ContextAlert>
            ))}
        </div>
    )
}
export default AlertList;
