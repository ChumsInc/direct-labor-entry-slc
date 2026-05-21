import type {EmployeeFilter} from "../common-types";
import {selectEmployeesActionStatus} from "./selectors";
import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {fetchEmployees, postEmployee} from "./api";
import type {RootState} from "@/app/configureStore";
import type {SortProps} from "@chumsinc/sortable-tables";
import type {DLEmployee} from 'chums-types'

export const setCurrentEmployee = createAction<DLEmployee | null>('employees/setCurrent');
export const toggleShowInactiveEmployees = createAction<boolean | undefined>('employees/showInactive');
export const setEmployeeDepartment = createAction<EmployeeFilter>('employees/setDepartment');
export const setEmployeeFilter = createAction<string>('employees/setFilter');
export const setEmployeesSort = createAction<SortProps<DLEmployee>>('employees/setSort');

export const loadEmployees = createAsyncThunk<DLEmployee[]>(
    'employees/loadList',
    async () => {
        return await fetchEmployees();
    },
    {
        condition: (_, {getState}) => {
            const state = getState() as RootState;
            return selectEmployeesActionStatus(state) === 'idle';
        }
    })

export const saveEmployee = createAsyncThunk<DLEmployee | null, DLEmployee>(
    'employees/saveCurrent',
    async (arg) => {
        return await postEmployee(arg);
    },
    {
        condition: (_, {getState}) => {
            const state = getState() as RootState;
            return selectEmployeesActionStatus(state) === 'idle';
        }
    }
)
