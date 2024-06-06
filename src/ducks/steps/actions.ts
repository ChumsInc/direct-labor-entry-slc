import {createAsyncThunk} from "@reduxjs/toolkit";
import {fetchSteps} from "./api";
import {RootState} from "../../app/configureStore";
import {selectStepsLoading} from "./selectors";
import {DLStep} from "chums-types";

export const loadSteps = createAsyncThunk<DLStep[], void>(
    'steps/load',
    async () => {
        return fetchSteps();
    },
    {
        condition: (_, {getState}) => {
            const state = getState() as RootState;
            return !selectStepsLoading(state);
        }
    }
)
