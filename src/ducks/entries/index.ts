import {combineReducers} from 'redux';
import {
    ADD_HURR_ENTRY,
    CLEAR_HURR_ENTRIES,
    DELETE_HURR_ENTRY,
    DELETE_HURRICANE_ENTRY,
    FETCH_HURRICANE_ENTRIES,
    LOADING_HURR_STEPS,
    LOADING_HURR_STEPS_FAILURE,
    NEW_ENTRY,
    RECEIVE_HURR_STEPS,
    SAVE_HURRICANE_ENTRY,
    SAVING_HURR_ENTRY,
    SAVING_HURR_ENTRY_FAILURE,
    SAVING_HURR_ENTRY_SUCCESS,
    hurricaneSelectEmployee,
    hurricaneSelectEntry,
    hurricaneUpdateEntry,
    hurricaneSetEntryDate,
    UPDATE_HURR_ENTRY,
    entriesSaveSucceeded,
    entriesFetchListSucceeded,
    entriesFetchListRequested,
    entriesFetchListFailed, entriesDeleteSucceeded, entriesFilterWorkCenter
} from "./constants";
import {FETCH_INIT, FETCH_SUCCESS} from "../../constants/app";
import {previousHurricaneWorkDay} from "../../utils/workDays";
import {BasicEntry, Employee, Entry} from "../common-types";
import {EntryAction} from "./actionTypes";
import {entryDefaultSort, entrySorter} from "./utils";
import {newEmployee} from "../employees/constants";

const workCenterFilterReducer = (state:string[] = [], action:EntryAction):string[] => {
    const {type, payload} = action;
    switch (type) {
    case entriesFilterWorkCenter:
        return payload?.workCenters || [];
    default: return state;
    }
}

const entry = (state:Entry = {...NEW_ENTRY}, action:EntryAction):Entry => {
    const {type, payload} = action;
    switch (type) {
    case hurricaneSelectEntry:
        if (payload?.entry) {
            return {...payload.entry};
        }
        return state;
    case hurricaneUpdateEntry:
        if (payload?.change) {
            return {...state, ...payload.change, changed: true};
        }
        return state;
    default:
        return state;
    }
};

const list = (state:Entry[] = [], action:EntryAction):Entry[] => {
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
    case CLEAR_HURR_ENTRIES:
    case hurricaneSetEntryDate:
        return [];
    default:
        return state;
    }
};

const isLoading = (state = false, action:EntryAction) => {
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

const isLoadingSteps = (state = false, action:EntryAction) => {
    switch (action.type) {
    case LOADING_HURR_STEPS:
        return true;
    case RECEIVE_HURR_STEPS:
    case LOADING_HURR_STEPS_FAILURE:
        return false;
    default:
        return state;
    }
};

const isSaving = (state = false, action:EntryAction) => {
    const {type, status} = action;
    switch (type) {
    case SAVE_HURRICANE_ENTRY:
    case DELETE_HURRICANE_ENTRY:
        return status === FETCH_INIT;
    case SAVING_HURR_ENTRY:
        return true;
    case SAVING_HURR_ENTRY_SUCCESS:
    case SAVING_HURR_ENTRY_FAILURE:
        return false;
    default:
        return state;
    }
};

const entryDate = (state:Date = previousHurricaneWorkDay(), action:EntryAction) => {
    const {type, payload} = action;
    switch (type) {
    case hurricaneSetEntryDate:
        if (payload?.date) {
            return payload.date;
        }
        return previousHurricaneWorkDay();
    default:
        return state;
    }
};

const employee = (state:Employee|null = null, action:EntryAction):Employee|null => {
    const {type, payload} = action;
    switch (type) {
    case hurricaneSelectEmployee:
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
