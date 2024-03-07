
import {Employee, EmployeeFilter, ActionStatus} from "../common-types";
import {Editable} from "chums-types/src/generics";
import {createReducer} from "@reduxjs/toolkit";
import {
    loadEmployees,
    saveEmployee,
    setCurrentEmployee,
    setEmployeeDepartment, setEmployeeFilter, setEmployeesSort,
    toggleShowInactiveEmployees
} from "./actions";
import {SortProps} from "chums-components";
import {employeeSorter} from "./utils";

export interface EmployeesState {
    list: Employee[];
    showInactive: boolean;
    department: 'slc'|'slc-temp'|'all';
    filter: string;
    current: (Employee & Editable)|null;
    actionStatus: ActionStatus;
    loaded: boolean;
    sort: SortProps<Employee>;
}

export const initialEmployeesState:EmployeesState = {
    list: [],
    showInactive: false,
    department: 'slc',
    filter: '',
    current: null,
    actionStatus: "idle",
    loaded: false,
    sort: {field: 'EmployeeNumber', ascending: true},
}

const employeesReducer = createReducer(initialEmployeesState, builder => {
    builder
        .addCase(loadEmployees.pending, (state) => {
            state.actionStatus = 'loading';
        })
        .addCase(loadEmployees.fulfilled, (state, action) => {
            state.actionStatus = 'idle';
            state.list = [...action.payload].sort(employeeSorter(initialEmployeesState.sort));
            if (state.current) {
                const [employee] = state.list.filter(emp => emp.EmployeeNumber === state.current?.EmployeeNumber);
                state.current = employee ?? null;
            }
        })
        .addCase(loadEmployees.rejected, (state) => {
            state.actionStatus = 'idle';
        })
        .addCase(setCurrentEmployee, (state, action) => {
            state.current = action.payload;
        })
        .addCase(toggleShowInactiveEmployees, (state, action) => {
            state.showInactive = action.payload ?? !state.showInactive;
        })
        .addCase(saveEmployee.pending, (state) => {
            state.actionStatus = 'saving';
        })
        .addCase(saveEmployee.fulfilled, (state, action) => {
            state.actionStatus = 'idle';
            state.current = action.payload;
            if (action.payload) {
                state.list = [
                    ...state.list.filter(emp => emp.EmployeeNumber !== action.meta.arg.EmployeeNumber),
                    action.payload,
                ].sort(employeeSorter(initialEmployeesState.sort));
            } else {
                state.list = [
                    ...state.list.filter(emp => emp.EmployeeNumber !== action.meta.arg.EmployeeNumber),
                ].sort(employeeSorter(initialEmployeesState.sort));
            }
        })
        .addCase(saveEmployee.rejected, (state) => {
            state.actionStatus = 'idle'
        })
        .addCase(setEmployeeDepartment, (state, action) => {
            state.department = action.payload;
        })
        .addCase(setEmployeeFilter, (state, action) => {
            state.filter = action.payload;
        })
        .addCase(setEmployeesSort, (state, action) => {
            state.sort = action.payload;
        })
});

export default employeesReducer;
