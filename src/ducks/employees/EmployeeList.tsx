import React, {ChangeEvent, useState} from 'react';
import {useSelector} from 'react-redux';
import {DEPARTMENT_NAMES} from './constants';
import {
    loadEmployees,
    setCurrentEmployee,
    setEmployeeDepartment,
    setEmployeeFilter,
    setEmployeesSort,
    toggleShowInactiveEmployees
} from './actions';
import {EmployeeFilter} from "../common-types";
import {
    selectCurrentEmployee,
    selectEmployeeFilter,
    selectEmployeesSort,
    selectLoading,
    selectShowInactive,
    selectVisibleEmployees
} from "./selectors";
import {
    FormCheck,
    SortableTable,
    SortableTableField,
    SortProps,
    SpinnerButton,
    TablePagination
} from "chums-components";
import DepartmentFilterSelect from "./DepartmentFilterSelect";
import classNames from "classnames";
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {DLDepartmentKey, DLEmployee} from "chums-types";

const EMPLOYEE_FIELDS: SortableTableField<DLEmployee>[] = [
    {field: 'EmployeeNumber', title: '#', sortable: true},
    {field: 'FullName', title: 'Name', sortable: true},
    {
        field: 'Department',
        title: 'Dept',
        render: row => DEPARTMENT_NAMES[row.Department as DLDepartmentKey] ?? row.Department,
        sortable: true,
    },
];


const EmployeeList = () => {
    const dispatch = useAppDispatch();
    const filter = useAppSelector(selectEmployeeFilter);
    const showInactive = useSelector(selectShowInactive);
    const selected = useSelector(selectCurrentEmployee);
    const loading = useSelector(selectLoading);
    const sort = useAppSelector(selectEmployeesSort);
    const list = useAppSelector(selectVisibleEmployees)

    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    const rowsPerPageChangeHandler = (rpp: number) => {
        setPage(0);
        setRowsPerPage(rpp);
    }

    const onChangeEmployeeDepartment = (ev: ChangeEvent<HTMLSelectElement>) => {
        dispatch(setEmployeeDepartment(ev.target.value as EmployeeFilter));
    }

    const sortChangeHandler = (sort: SortProps) => {
        dispatch(setEmployeesSort(sort))
    }

    const onChangeFilter = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(setEmployeeFilter(ev.target.value));
    }

    const onSelectEmployee = (emp: DLEmployee) => dispatch(setCurrentEmployee(emp));

    return (
        <div className="report-form">
            <div className="row g-3">
                <div className="col-auto">
                    <DepartmentFilterSelect onChange={onChangeEmployeeDepartment}/>
                </div>
                <div className="col-auto">
                    <input type="search" className="form-control form-control-sm" value={filter}
                           placeholder="Filter this list"
                           onChange={onChangeFilter}/>
                </div>
                <div className="col-auto">
                    <FormCheck type="checkbox" label="Show Inactive" checked={showInactive}
                               onChange={(ev) => dispatch(toggleShowInactiveEmployees(ev.target.checked))}/>
                </div>
                <div className="col-auto">
                    <SpinnerButton spinning={loading} type="button"
                                   onClick={() => dispatch(loadEmployees())} color="outline-primary" size="sm">
                        Reload
                    </SpinnerButton>
                </div>
            </div>
            <SortableTable keyField="EmployeeNumber" fields={EMPLOYEE_FIELDS} currentSort={sort}
                           onChangeSort={sortChangeHandler}
                           data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                           rowClassName={(row) => classNames({'table-warning': !row.active})}
                           selected={selected?.EmployeeNumber}
                           size="xs"
                           onSelectRow={onSelectEmployee}/>
            <TablePagination page={page} onChangePage={setPage}
                             rowsPerPage={rowsPerPage} onChangeRowsPerPage={rowsPerPageChangeHandler}
                             count={list.length}/>
        </div>
    )
}
export default EmployeeList;
