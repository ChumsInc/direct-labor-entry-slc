import {combineReducers} from "redux";
import {entriesSelectEntry} from "../entries/constants";
import {Entry, ITOrder, WorkOrder} from "../common-types";
import {ActionInterface, ActionPayload, fetchJSON} from "chums-ducks";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";
import {selectCurrentEntry} from "../entries/selectors";

export interface WOPayload extends ActionPayload {
    workOrder?: WorkOrder,
    itOrders?: ITOrder[],
    document?: string,
    entry?: Entry
}

export interface WOAction extends ActionInterface {
    payload?: WOPayload,
}

export interface WOThunkACtion extends ThunkAction<any, RootState, unknown, WOAction> {
}

export const docFetchReqeusted = 'work-order/docfetchRequested';
export const docFetchSucceeded = 'work-order/docfetchSucceeded';
export const docFetchFailed = 'work-order/docfetchFailed';

export const fetchDocumentAction = (): WOThunkACtion =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            const entry = selectCurrentEntry(state);
            if (!entry.DocumentNo || selectLoading(state)) {
                return;
            }

            dispatch({type: docFetchReqeusted});
            const urlWO = '/api/operations/production/wo/chums/:document'
                .replace(':document', encodeURIComponent(entry.DocumentNo.padStart(7, '0')));
            const urlIT = '/api/operations/production/wo/chums/it/:document'
                .replace(':document', encodeURIComponent(entry.DocumentNo.padStart(7, '0')));
            const wo = fetchJSON(urlWO);
            const it = fetchJSON(urlIT);
            const [woRes, itRes] = await Promise.all([wo, it]);
            const workOrder = !!woRes.workorder && !!woRes.workorder.operationDetail ? woRes.workorder : null;
            dispatch({
                type: docFetchSucceeded,
                payload: {workOrder, itOrders: itRes.result || []}
            })
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("fetchDocument()", error.message);
                return dispatch({type: docFetchFailed, payload: {error, context: docFetchReqeusted}})
            }
            console.error("fetchDocument()", error);
        }
    }

export const selectLoading = (state: RootState): boolean => state.workOrder.loading;
export const selectWorkOrder = (state: RootState): WorkOrder | null => state.workOrder.workOrder;
export const selectITOrders = (state: RootState): ITOrder[] => state.workOrder.itOrders;


const workOrderReducer = (state: WorkOrder | null = null, action: WOAction): WorkOrder | null => {
    const {type, payload} = action;
    switch (type) {
    case entriesSelectEntry:
        return null;
    case docFetchSucceeded:
        if (payload?.workOrder) {
            return payload.workOrder;
        }
        return null;
    default:
        return state;
    }
}

const itOrdersReducer = (state: ITOrder[] = [], action: WOAction): ITOrder[] => {
    const {type, payload} = action;
    switch (type) {
    case entriesSelectEntry:
        return [];
    case docFetchSucceeded:
        if (payload?.itOrders) {
            return payload.itOrders;
        }
        return [];
    default:
        return state;
    }
}

const loadingReducer = (state: boolean = false, action: WOAction): boolean => {
    switch (action.type) {
    case docFetchReqeusted:
        return true;
    case docFetchFailed:
    case docFetchSucceeded:
        return false;
    default:
        return state;
    }
}

export default combineReducers({
    workOrder: workOrderReducer,
    itOrders: itOrdersReducer,
    loading: loadingReducer,
})
