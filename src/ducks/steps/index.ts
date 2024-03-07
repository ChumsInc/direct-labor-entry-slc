import {ActionStatus, Step} from "../common-types";
import {createReducer} from "@reduxjs/toolkit";
import {loadSteps} from "./actions";
import {SortProps} from "chums-components";
import {stepSorter} from "./utils";
import {reSLCWorkCenter} from "../../contants";

export interface StepsState {
    list: Step[];
    status: ActionStatus;
    loaded: boolean;
    sort: SortProps<Step>
}

export const initialState: StepsState = {
    list: [],
    status: 'idle',
    loaded: false,
    sort: {field: 'id', ascending: true},
}


const stepsReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(loadSteps.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(loadSteps.fulfilled, (state, action) => {
            state.status = 'idle';
            state.list = action.payload
                .filter(step => reSLCWorkCenter.test(step.workCenter))
                .sort(stepSorter({...initialState.sort}));
            state.loaded = true;
        })
        .addCase(loadSteps.rejected, (state, action) => {
            state.status = 'idle';
        })
});

export default stepsReducer;
