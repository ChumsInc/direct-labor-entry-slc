import {ActionStatus, ITOrder} from "../common-types";
import {WorkTicket} from 'chums-types'
import {createReducer} from "@reduxjs/toolkit";
import {loadDocument, setWorkTicketNo} from "./actions";
import {saveEntry} from "../entries/actions";

export interface WorkTicketState {
    workTicket: WorkTicket | null;
    itOrders: ITOrder[];
    documentNo: string;
    status: ActionStatus;
    errorMessage: string | null;
}

const initialState: WorkTicketState = {
    workTicket: null,
    itOrders: [],
    documentNo: '',
    status: "idle",
    errorMessage: null,
}

const workTicketReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(setWorkTicketNo, (state, action) => {
            state.documentNo = action.payload;
        })
        .addCase(loadDocument.pending, (state) => {
            state.status = 'loading';
            state.workTicket = null;
            state.itOrders = [];
        })
        .addCase(loadDocument.fulfilled, (state, action) => {
            state.status = 'idle';
            state.workTicket = action.payload.workTicket ?? null;
            state.itOrders = action.payload.itOrder ?? [];
            if (action.payload?.workTicket) {
                state.documentNo = action.payload.workTicket.WorkTicketNo;
            } else if (action.payload.itOrder.length > 0) {
                state.documentNo = action.payload.itOrder[0].PurchaseOrderNo;
            } else {
                state.errorMessage = 'Document not found';
            }
        })
        .addCase(loadDocument.rejected, (state, action) => {
            state.status = 'idle';
            state.errorMessage = action.error.message ?? 'Unknown error';
        })
        .addCase(saveEntry.fulfilled, (state) => {
            state.itOrders = [];
            state.workTicket = null;
        })
});

export default workTicketReducer;
