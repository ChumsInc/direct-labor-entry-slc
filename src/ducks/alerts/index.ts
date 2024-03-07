/* eslint-disable  @typescript-eslint/no-explicit-any */
import {AsyncThunk, createAction, createReducer, isRejected, UnknownAction} from "@reduxjs/toolkit";
import {RootState} from "../../app/configureStore";
import {BasicAlert} from "chums-components";

export interface ErrorAlert extends BasicAlert {
    id: number;
    count: number;
}

export interface AlertsState {
    nextId: number;
    list: ErrorAlert[];
}

export const initialAlertsState: AlertsState = {
    nextId: 0,
    list: [],
}

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']> & {
    error: Error;
}

export const dismissAlert = createAction<number>('alerts/dismiss');
export const addAlert = createAction<ErrorAlert>('alerts/addAlert');

export const selectAlerts = (state:RootState) => state.alerts.list;

function isErrorAction(action: UnknownAction): action is RejectedAction {
    return !!(action as RejectedAction).error;
}


const alertsReducer = createReducer(initialAlertsState, (builder) => {
    builder
        .addCase(dismissAlert, (state, action) => {
            state.list = state.list.filter(alert => alert.id !== action.payload);
        })
        .addCase(addAlert, (state, action) => {
            const [contextAlert] = state.list.filter(alert => action.payload.context !== '' && alert.context === action.payload.context)
            if (contextAlert) {
                contextAlert.count += 1;
                state.list = [
                    ...state.list.filter(alert => action.payload.context !== '' && alert.context === action.payload.context),
                    contextAlert
                ];
            } else {
                state.list.push({...action.payload, id: state.nextId});
                state.nextId += 1;
            }
        })
        .addMatcher(isErrorAction, (state, action) => {
            const context = action.type.replace('/rejected', '');
            let [contextAlert] = state.list.filter(alert => alert.context === context);
            if (!contextAlert) {
                contextAlert = {id: state.nextId, count: 1, message: action.error.message ?? '', context, color: 'danger'}
                state.nextId += 1;
            } else {
                contextAlert.count += 1;
            }
            state.list = [
                ...state.list.filter(alert => alert.context !== context),
                contextAlert,
            ];
        })
        .addDefaultCase((state, action) => {
            if (isRejected(action) && action.error) {
                state.list.push({
                    context: action.type.replace('/rejected', ''),
                    message: action.error.message ?? '',
                    id: state.nextId,
                    count: 1
                });
                state.nextId += 1;
            }
        })
});

export default alertsReducer;
