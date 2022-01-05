import {Entry} from "../common-types";

export const entriesFetchListRequested = 'entries/fetchListRequested';
export const entriesFetchListSucceeded = 'entries/fetchListSucceeded';
export const entriesFetchListFailed = 'entries/fetchListFailed';

export const entriesSaveRequested = 'entries/saveRequested';
export const entriesSaveSucceeded = 'entries/saveSucceeded';
export const entriesSaveFailed = 'entries/saveFailed';

export const entriesDeleteRequested = 'entries/deleteRequested';
export const entriesDeleteSucceeded = 'entries/deleteSucceeded';
export const entriesDeleteFailed = 'entries/deleteFailed';

export const entriesFilterWorkCenter = 'entries/filterWorkCenter';


export const entriesUpdateEntry = 'entries/updateEntry';

export const entriesSelectEntry = 'entries/selectEntry';

export const entriesSetEntryDate = 'entries/setEntryDate';

export const NEW_ENTRY: Entry = {
    id: 0,
    EmployeeNumber: '',
    WorkCenter: '',
    FullName: '',
    EntryDate: null,
    LineNo: 1,
    idSteps: 0,
    Minutes: 0,
    Quantity: 0,
    StandardAllowedMinutes: 0,
    AllowedMinutes: 0,
    UPH: 0,
    StdUPH: 0,
    Description: '',
    DocumentNo: '',
    DocumentType: '',
    ItemCode: '',
    WarehouseCode: '',
    StepCode: '',
};
