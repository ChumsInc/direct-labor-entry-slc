import {combineReducers} from 'redux';
import {
    entriesDeleteFailed,
    entriesDeleteRequested,
    entriesDeleteSucceeded,
    entriesFetchListFailed,
    entriesFetchListRequested,
    entriesFetchListSucceeded,
    entriesFilterWorkCenter,
    entriesSaveFailed,
    entriesSaveRequested,
    entriesSaveSucceeded,
    entriesSelectEntry,
    entriesSetEntryDate,
    entriesUpdateEntry,
    NEW_ENTRY
} from "./constants";
import {previousHurricaneWorkDay, previousSLCWorkDay} from "../../utils/workDays";
import {Employee, Entry} from "../common-types";
import {EntryAction} from "./actionTypes";
import {entryDefaultSort, entrySorter} from "./utils";
import {employeeSelected} from "../employees/actionTypes";

const workCenterFilterReducer = (state: string[] = [], action: EntryAction): string[] => {
    const {type, payload} = action;
    switch (type) {
    case entriesFilterWorkCenter:
        return payload?.workCenters || [];
    default:
        return state;
    }
}

const entry = (state: Entry = {...NEW_ENTRY}, action: EntryAction): Entry => {
    const {type, payload} = action;
    switch (type) {
    case entriesSelectEntry:
        if (payload?.entry) {
            return {...payload.entry};
        }
        return state;
    case entriesUpdateEntry:
        if (payload?.change) {
            return {...state, ...payload.change, changed: true};
        }
        return state;
    default:
        return state;
    }
};

const list = (state: Entry[] = [], action: EntryAction): Entry[] => {
    const {type, status, payload} = action;
    switch (type) {
    case entriesFetchListSucceeded:
        if (payload?.list) {
            return [...payload.list].sort(entrySorter(entryDefaultSort));
        }
        return state;
    case entriesSaveSucceeded:
        if (payload?.savedEntry) {
            return [
                ...state.filter(e => e.id !== payload.savedEntry?.id),
                {...payload.savedEntry}
            ].sort(entrySorter(entryDefaultSort))
        }
        return state;
    case entriesDeleteSucceeded:
        if (payload?.id) {
            return [
                ...state.filter(e => e.id !== payload.id)
            ].sort(entrySorter(entryDefaultSort));
        }
        return state;
    case entriesSetEntryDate:
        return [];
    default:
        return state;
    }
};

const isLoading = (state = false, action: EntryAction) => {
    const {type, status} = action;
    switch (type) {
    case entriesFetchListRequested:
        return true;
    case entriesFetchListSucceeded:
    case entriesFetchListFailed:
        return false;
    default:
        return state;
    }
};


const isSaving = (state = false, action: EntryAction) => {
    const {type} = action;
    switch (type) {
    case entriesSaveRequested:
        return true;
    case entriesSaveSucceeded:
    case entriesSaveFailed:
        return false;
    case entriesDeleteRequested:
        return true;
    case entriesDeleteSucceeded:
    case entriesDeleteFailed:
        return false;
    default:
        return state;
    }
};

const entryDate = (state: Date = previousHurricaneWorkDay(), action: EntryAction) => {
    const {type, payload} = action;
    switch (type) {
    case entriesSetEntryDate:
        if (payload?.date) {
            return payload.date;
        }
        return previousSLCWorkDay();
    default:
        return state;
    }
};

const employee = (state: Employee | null = null, action: EntryAction): Employee | null => {
    const {type, payload} = action;
    switch (type) {
    case employeeSelected:
        if (payload?.employee) {
            return {...payload.employee}
        }
        return null;
    default:
        return state;
    }
};


export default combineReducers({
    workCenterFilter: workCenterFilterReducer,
    list,
    isLoading,
    isSaving,
    entryDate,
    entry,
    employee,
});
