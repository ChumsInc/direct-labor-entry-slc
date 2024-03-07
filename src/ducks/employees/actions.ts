import {Employee, EmployeeFilter} from "../common-types";
import {selectEmployeesActionStatus} from "./selectors";
import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {fetchEmployees, postEmployee} from "./api";
import {RootState} from "../../app/configureStore";
import {SortProps} from "chums-components";

export const setCurrentEmployee = createAction<Employee | null>('employees/setCurrent');
export const toggleShowInactiveEmployees = createAction<boolean | undefined>('employees/showInactive');
export const setEmployeeDepartment = createAction<EmployeeFilter>('employees/setDepartment');
export const setEmployeeFilter = createAction<string>('employees/setFilter');
export const setEmployeesSort = createAction<SortProps<Employee>>('employees/setSort');

export const loadEmployees = createAsyncThunk<Employee[]>(
    'employees/loadList',
    async () => {
        return await fetchEmployees();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectEmployeesActionStatus(state) === 'idle';
        }
    })

export const saveEmployee = createAsyncThunk<Employee | null, Employee>(
    'employees/saveCurrent',
    async (arg) => {
        return await postEmployee(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectEmployeesActionStatus(state) === 'idle'
                && arg.EmployeeNumber !== '';
        }
    }
)
