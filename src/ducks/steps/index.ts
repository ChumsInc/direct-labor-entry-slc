import {combineReducers} from "redux";
import {ActionInterface, ActionPayload, fetchJSON} from "chums-ducks";
import {Step} from "../common-types";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";

export interface StepsPayload extends ActionPayload {
    list?: Step[],
}

export interface StepsAction extends ActionInterface {
    payload?: StepsPayload,
}

export interface StepsThunkAction extends ThunkAction<any, RootState, unknown, StepsAction> {}

export const stepsURL = '/api/operations/production/dl/steps';

export const stepsFetchRequested = 'steps/fetchRequested';
export const stepsFetchSucceeded = 'steps/fetchSucceeded';
export const stepsFetchFailed = 'steps/fetchFailed';

export const stepSorter = (a:Step, b:Step) => a.stepCode.toLowerCase() > b.stepCode.toLowerCase() ? 1 : -1;

export const selectSteps = (state:RootState) => state.dlSteps.list;
export const selectHurricaneSteps = (state:RootState) => state.dlSteps.list
    .filter(step => step.active)
    .filter(step => ['CHU','CON'].includes(step.workCenter))
    .sort(stepSorter);

export const selectSLCSteps = (workCenter:string) => (state:RootState) => state.dlSteps.list
    .filter(step => step.active)
    .filter(step => step.workCenter === workCenter)
    .sort(stepSorter);

export const selectLoading = (state:RootState) => state.dlSteps.loading;

export const fetchSteps = ():StepsThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectLoading(state)) {
                return;
            }
            dispatch({type: stepsFetchRequested});
            const res = await fetchJSON(stepsURL, {cache: 'force-cache'});
            dispatch({type: stepsFetchSucceeded, payload: {list: res.steps}});
        } catch(error:unknown) {
            if (error instanceof Error) {
                console.log("fetchSteps()", error.message);
                return dispatch({type:stepsFetchFailed, payload: {error, context: stepsFetchRequested}})
            }
            console.error("fetchSteps()", error);
        }
};

const listReducer = (state:Step[] = [], action:StepsAction):Step[] => {
    const {type, payload} = action;
    switch (type) {
    case stepsFetchSucceeded:
        if (payload?.list) {
            return payload.list.sort(stepSorter);
        }
        return [];
    default:
        return state;
    }
}

const loadingReducer = (state:boolean = false, action:StepsAction):boolean => {
    switch (action.type) {
    case stepsFetchRequested:
        return true;
    case stepsFetchFailed:
    case stepsFetchSucceeded:
        return false;
    default: return state;
    }
}

export default combineReducers({
    list: listReducer,
    loading: loadingReducer,
})
