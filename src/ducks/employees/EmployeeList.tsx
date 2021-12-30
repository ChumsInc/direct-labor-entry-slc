import React, {ChangeEvent, Component, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {connect, useDispatch, useSelector} from 'react-redux';
import {DEPARTMENT_NAMES, DEPARTMENTS, EMPLOYEE_FILTERS} from './constants';
import {fetchEmployees, selectEmployeeAction, setEmployeeVisibilityFilter, showInactiveAction} from './actions';
import {Department, Employee, EmployeeFilter, EmployeeSorterProps, EmployeeTableField} from "../common-types";
import {selectCurrentEmployee, selectLoading, selectShowInactive, selectVisibleEmployees} from "./selectors";
import {
    addPageSetAction,
    FormCheck,
    selectPagedData,
    tableAddedAction,
    SortableTable,
    PagerDuck,
    selectTableSort, SpinnerButton
} from "chums-ducks";
import DepartmentFilterSelect from "./DepartmentFilterSelect'";
import classNames from "classnames";

const EMPLOYEE_FIELDS:EmployeeTableField[] = [
    {field: 'FullName', title: 'Name'},
    {field: 'Department', title: 'Dept', render: row => DEPARTMENT_NAMES[row.Department as Department] || row.Department},
];

const tableId = 'employee-list'
const EmployeeList:React.FC = () => {
    const dispatch = useDispatch();
    const [filter, setFilter] = useState('');
    const showInactive = useSelector(selectShowInactive);
    const selected = useSelector(selectCurrentEmployee);
    const loading = useSelector(selectLoading);

    useEffect(() => {
        dispatch(addPageSetAction({key: tableId}));
        dispatch(tableAddedAction({key: tableId, field: 'FullName', ascending: true}));
    }, []);

    let listFilter = /^/;
    try {
        listFilter = new RegExp(filter, 'i');
    } catch(error:unknown) {
        listFilter = /^/;
    }
    const sort:EmployeeSorterProps = useSelector(selectTableSort(tableId)) as EmployeeSorterProps;
    const list = useSelector(selectVisibleEmployees(sort));
    const filteredList = list.filter(emp => !filter || listFilter.test(emp.FullName) || listFilter.test(emp.FirstName) || listFilter.test(emp.LastName));
    const pagedList = useSelector(selectPagedData(tableId, filteredList));

    const onChangeEmployeeFilter = (ev:ChangeEvent<HTMLSelectElement>) => dispatch(setEmployeeVisibilityFilter(ev.target.value as EmployeeFilter));

    const onChangeFilter = (ev:ChangeEvent<HTMLInputElement>) => {
        setFilter(ev.target.value);
    }

    const onSelectEmployee = (emp:Employee) => dispatch(selectEmployeeAction(emp));

    return (
        <div className="report-form">
            <div className="row g-3">
                <div className="col-auto">
                    <DepartmentFilterSelect onChange={onChangeEmployeeFilter} />
                </div>
                <div className="col-auto">
                    <input type="search" className="form-control form-control-sm" value={filter}
                           placeholder="Filter this list"
                           onChange={onChangeFilter} />
                </div>
                <div className="col-auto">
                    <FormCheck type="checkbox" label="Show Inactive" checked={showInactive}
                               onClick={() => dispatch(showInactiveAction(!showInactive))} />
                </div>
                <div className="col-auto">
                    <SpinnerButton spinning={loading} type="button"
                                   onClick={() => dispatch(fetchEmployees())} color="outline-primary" size="sm">
                        Reload
                    </SpinnerButton>
                </div>
            </div>
            <SortableTable tableKey={tableId} keyField="EmployeeNumber" fields={EMPLOYEE_FIELDS} data={pagedList}
                           rowClassName={(row) => classNames({'table-warning': !row.active})}
                           selected={selected?.EmployeeNumber}
                           size="xs"
                           onSelectRow={onSelectEmployee} />
            <PagerDuck dataLength={list.length} pageKey={tableId} filtered={list.length !== filteredList.length} />
        </div>
    )
}
export default EmployeeList;


// uf4!eMpU14^tCIgI
