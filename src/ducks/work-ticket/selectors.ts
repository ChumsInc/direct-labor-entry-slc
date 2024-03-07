import {RootState} from "../../app/configureStore";


export const selectWorkTicketLoading = (state: RootState): boolean => state.workTicket.status === 'loading';
export const selectWorkTicket = (state: RootState) => state.workTicket.workTicket;
export const selectITOrders = (state: RootState) => state.workTicket.itOrders;
export const selectWorkTicketDocumentNo = (state:RootState) => state.workTicket.documentNo;

