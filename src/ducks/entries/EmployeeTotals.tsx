import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import numeral from "numeral";
import {SortableTable, SortableTableField, SortProps} from "@chumsinc/sortable-tables";
import {selectCurrentEmployee, selectEmployeeList} from "../employees/selectors";
import {loadEntries, setEntryEmployee, setEntryTotalsSort} from "./actions";
import {selectEmployeeTotals, selectEntriesLoading, selectEntryDate, selectEntryTotalsSort} from "./selectors";
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import Decimal from "decimal.js";
import {EmployeeDLEntryTotal} from "chums-types";
import {SpinnerButton} from "@chumsinc/react-bootstrap-addons";

const employeeTableFields: SortableTableField<EmployeeDLEntryTotal>[] = [
    {field: 'FullName', title: 'Name', sortable: true},
    {
        field: 'Minutes',
        title: 'Minutes',
        sortable: true,
        render: (row: EmployeeDLEntryTotal) => numeral(row.Minutes).format('0,0'),
        align: 'end',
    },
    {
        field: 'AllowedMinutes',
        title: 'Allowed',
        sortable: true,
        render: (row: EmployeeDLEntryTotal) => numeral(row.AllowedMinutes).format('0,0'),
        align: 'end',
    },
    {
        field: 'Rate',
        title: 'Rate',
        sortable: true,
        render: row => numeral(row.Rate).format('0.0%'),
        align: 'end',
    }
];

const initialTotal: EmployeeDLEntryTotal = {
    EmployeeNumber: 'TOTAL',
    FullName: 'Total',
    Rate: 0,
    Minutes: 0,
    AllowedMinutes: 0
};

const EmployeeTotals: React.FC = () => {
    const dispatch = useAppDispatch();
    const date = useAppSelector(selectEntryDate);
    const sort = useSelector(selectEntryTotalsSort);
    const employeeTotals = useSelector(selectEmployeeTotals);
    const employees = useSelector(selectEmployeeList);
    const selected = useSelector(selectCurrentEmployee);
    const isLoading = useSelector(selectEntriesLoading);

    useEffect(() => {
        onReload();
    }, [date]);

    const onReload = () => {
        if (date) {
            dispatch(loadEntries({entryDate: date}));
        }
    }

    const onSelectEmployee = (total: EmployeeDLEntryTotal) => {
        const [employee] = employees.filter(emp => emp.EmployeeNumber === total.EmployeeNumber);
        dispatch(setEntryEmployee(employee || null));
    }

    const sortChangeHandler = (sort: SortProps<EmployeeDLEntryTotal>) => {
        dispatch(setEntryTotalsSort(sort));
    }

    const total: EmployeeDLEntryTotal = employeeTotals.reduce((pv, cv) => {
        const minutes = new Decimal(pv.Minutes).add(cv.Minutes).toString();
        const allowedMinutes = new Decimal(pv.AllowedMinutes).add(cv.AllowedMinutes).toString();
        return {
            ...cv,
            Minutes: minutes,
            AllowedMinutes: allowedMinutes,
            Rate: new Decimal(minutes).eq(0) ? 0 : new Decimal(allowedMinutes).dividedBy(minutes).toString()
        };
    }, {...initialTotal});

    const tfoot = (
        <tfoot>
        <tr>
            <td>Total</td>
            <td className="text-end">{numeral(total.Minutes).format('0,0')}</td>
            <td className="text-end">{numeral(total.AllowedMinutes).format('0,0')}</td>
            <td className="text-end">{numeral(total.Rate).format('0.0%')}</td>
        </tr>
        </tfoot>
    )

    return (
        <div>
            <div className="row g-3">
                <h4 className="col">Employee Totals</h4>
                <div className="col-auto">
                    <SpinnerButton spinning={isLoading} onClick={onReload} size="sm" spinnerProps={{size: 'sm'}}>Reload</SpinnerButton>
                </div>
            </div>
            <SortableTable currentSort={sort} onChangeSort={sortChangeHandler} size="sm"
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
