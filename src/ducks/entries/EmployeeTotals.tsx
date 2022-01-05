import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import numeral from "numeral";
import {selectTableSort, SortableTable, SpinnerButton, tableAddedAction} from "chums-ducks";
import {EmployeeEntryTotal, EmployeeTotalSorterProps, EmployeeTotalTableField} from "../common-types";
import {selectCurrentEmployee, selectEmployeeList} from "../employees/selectors";
import {fetchEntriesAction, newEntryAction} from "./actions";
import {selectEmployeeTotals, selectLoading} from "./selectors";
import {selectEmployeeAction} from "../employees/actions";

const employeeTableFields: EmployeeTotalTableField[] = [
    {field: 'FullName', title: 'Name', sortable: true},
    {
        field: 'Minutes',
        title: 'Minutes',
        sortable: true,
        render: (row: EmployeeEntryTotal) => numeral(row.Minutes).format('0,0'),
        className: 'text-end'
    },
    {
        field: 'AllowedMinutes',
        title: 'Allowed',
        sortable: true,
        render: (row: EmployeeEntryTotal) => numeral(row.AllowedMinutes).format('0,0'),
        className: 'right'
    },
    {
        field: 'Rate',
        title: 'Rate',
        sortable: true,
        render: row => numeral(row.Rate).format('0.0%'),
        className: 'text-end'
    }
];

const tableId = 'hurricane-employee-totals';

const EmployeeTotals: React.FC = () => {
    const dispatch = useDispatch();
    const sort = useSelector(selectTableSort(tableId));
    const employeeTotals = useSelector(selectEmployeeTotals(sort as EmployeeTotalSorterProps));
    const employees = useSelector(selectEmployeeList);
    const selected = useSelector(selectCurrentEmployee);
    const isLoading = useSelector(selectLoading);
    useEffect(() => {
        dispatch(tableAddedAction({key: tableId, field: 'FullName', ascending: true}));
    }, [])

    const onReload = () => dispatch(fetchEntriesAction());

    const onSelectEmployee = (total: EmployeeEntryTotal) => {
        const [employee] = employees.filter(emp => emp.EmployeeNumber === total.EmployeeNumber);
        dispatch(selectEmployeeAction(employee || null));
        dispatch(newEntryAction());
    }

    const total = employeeTotals.reduce((pv, cv) => {
        return {
            Minutes: pv.Minutes + cv.Minutes,
            AllowedMinutes: pv.AllowedMinutes + cv.AllowedMinutes
        };
    }, {Minutes: 0, AllowedMinutes: 0});

    const tfoot = (
        <tfoot>
        <tr>
            <td>Total</td>
            <td className="text-end">{numeral(total.Minutes).format('0,0')}</td>
            <td className="text-end">{numeral(total.AllowedMinutes).format('0,0')}</td>
            <td className="text-end">{numeral(!!total.Minutes ? total.AllowedMinutes / total.Minutes : 0).format('0.0%')}</td>
        </tr>
        </tfoot>
    )

    return (
        <div>
            <div className="row g-3">
                <h4 className="col">Employee Totals</h4>
                <div className="col-auto">
                    <SpinnerButton spinning={isLoading} onClick={onReload} size="sm">Reload</SpinnerButton>
                </div>
            </div>
            <SortableTable tableKey={tableId} size="sm"
                           fields={employeeTableFields}
                           data={employeeTotals}
                           keyField="EmployeeNumber"
                           onSelectRow={onSelectEmployee}
                           selected={row => row.EmployeeNumber === selected?.EmployeeNumber}
                           tfoot={tfoot}
            />
        </div>
    );
}
export default EmployeeTotals;
