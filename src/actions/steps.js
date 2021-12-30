import {FETCH_DL_STEPS, LOADING_DL_STEPS, LOADING_DL_STEPS_FAILURE, RECEIVE_DL_STEPS} from "../constants/steps";
import StepCode from "../types/StepCode";
import {fetchGET} from "./fetch";
import {FETCH_STEPS} from "../constants/hurricane-entries";
import {FETCH_FAILURE, FETCH_INIT, FETCH_SUCCESS} from "../constants/app";
import {API_PATH_STEPS} from "../constants/paths";
import {handleError} from "./app";

const shouldReceiveSteps = (state) => {
    return !state.dlSteps.isLoading
        && state.dlSteps.list.length === 0
};

const receiveSteps = (steps) => ({type: RECEIVE_DL_STEPS, steps});

export const fetchStepsIfNeeded = () => (dispatch, getState) => {
    if (shouldReceiveSteps(getState())) {
        dispatch({type: FETCH_DL_STEPS, status: FETCH_INIT});
        fetchGET(API_PATH_STEPS)
            .then(res => {
                if (res.error) {
                    dispatch({type: FETCH_DL_STEPS, status: FETCH_FAILURE});
                    dispatch(handleError(new Error(res.error)));
                }
                const steps = res.result;
                dispatch({type: FETCH_DL_STEPS, status:FETCH_SUCCESS, steps});
            })
            .catch(err => {
                dispatch({type: FETCH_DL_STEPS, status: FETCH_FAILURE});
                dispatch(handleError(err, FETCH_DL_STEPS));
            });
    }
};

export const loadSteps = () => ({type: LOADING_DL_STEPS});
