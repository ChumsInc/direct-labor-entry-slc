import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {WorkTicketResponse} from "../common-types";
import {fetchDocument} from "./api";
import {RootState} from "../../app/configureStore";
import {selectWorkTicketLoading} from "./selectors";

export const loadDocument = createAsyncThunk<WorkTicketResponse, string>(
    'work-ticket/loadDocument',
    async (arg) => {
        return await fetchDocument(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectWorkTicketLoading(state);
        }
    }
)

export const setWorkTicketNo = createAction<string>('work-ticket/setDocumentNo');
