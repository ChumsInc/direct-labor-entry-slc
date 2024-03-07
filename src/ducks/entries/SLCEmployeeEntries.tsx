import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import numeral from "numeral";
import {between, MAX_DANGER, MAX_SUCCESS, MIN_DANGER, MIN_SUCCESS, rate} from './utils';
import {Alert, ProgressBar, SortableTable, SortableTableField, SortProps, TablePagination} from "chums-components";
import {
    selectCurrentEmployee,
    selectCurrentEntry,
    selectEmployeeEntryList,
    selectEntryDate,
    selectEntrySort,
    selectEntriesLoading
} from "./selectors";
import {Entry} from "../common-types";
import {loadEntries, setCurrentEntry, setEntriesSort} from "./actions";
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import Decimal from "decimal.js";

const entryTableFields: SortableTableField<Entry>[] = [
    {field: 'WorkCenter', title: 'W/C', sortable: true},
    {field: 'StepCode', title: 'Operation', sortable: true},
    {field: 'Description', title: 'Description', className: 'dle--entry-description', sortable: true},
    {field: 'DocumentNo', title: 'WO/IT #', sortable: true, render: (row) => row.DocumentNo.replace(/^0+/, '')},
    {
        field: 'Minutes',
        title: 'Minutes',
        render: ({Minutes}) => numeral(Minutes).format('0,0'),
        className: 'right',
        sortable: true
    },
    {
        field: 'Quantity',
        title: 'Quantity',
        render: ({Quantity}) => numeral(Quantity).format('0,0'),
        className: 'right',
        sortable: true
    },
    // {field: 'AllowedMinutes', title: 'Allowed Minutes', render: (entry:Entry) => numeral(entry.AllowedMinutes).format('0,0'), className: 'right'},
    {
        field: 'AllowedMinutes',
        title: 'Rate',
        render: (entry: Entry) => numeral(rate(entry)).format('0.0000'),
        className: 'right',
        sortable: true
    },
    {field: 'UPH', title: 'UPH', render: ({UPH}) => numeral(UPH).format('0,0'), className: 'right', sortable: true},
    {
        field: 'StandardAllowedMinutes',
        title: "SAM",
        render: ({StandardAllowedMinutes}) => numeral(StandardAllowedMinutes).format('0.0000'),
        className: 'right border-left',
        sortable: true
    },
    {
        field: 'StdUPH',
        title: 'Std UPH',
        render: ({StdUPH}) => numeral(StdUPH).format('0,0'),
        className: 'right',
        sortable: true
    },
    {
        field: 'AllowedMinutes',
        title: 'Rate %',
        render: (row) => numeral(row.StdUPH ? row.UPH / row.StdUPH : 1).format('0.0%'),
        className: 'right border-left',
        sortable: true
    },
];

const entryRate = (entry: Entry) => {
    return new Decimal(entry.AllowedMinutes).eq(0) ? 0 : new Decimal(entry.Minutes).dividedBy(entry.AllowedMinutes).toNumber();
}


const rowClassName = (entry: Entry) => {
    return {
        'text-danger': entryRate(entry) !== 0 && (entryRate(entry) < MIN_DANGER || entryRate(entry) > MAX_DANGER),
        'text-warning': entryRate(entry) !== 0 && (between(entryRate(entry), [MIN_DANGER, MIN_SUCCESS]) || (between(entryRate(entry), [MAX_SUCCESS, MAX_DANGER]))),
        'text-success': !!entryRate(entry) && between(entryRate(entry), [MIN_SUCCESS, MAX_SUCCESS]),
    }
};

export interface EntryTotal {
    Minutes: number|string;
    Quantity: number|string;
    AllowedMinutes: number|string;
    ratePct: number|string;
}
const initialTotal:EntryTotal = {Minutes: 0, Quantity: 0, AllowedMinutes: 0, ratePct: 0}

const SLCEmployeeEntries = () => {
    const dispatch = useAppDispatch();
    const date = useAppSelector(selectEntryDate);
    const employee = useSelector(selectCurrentEmployee);
    const loading = useSelector(selectEntriesLoading);
    const sort = useSelector(selectEntrySort);
    const list = useSelector(selectEmployeeEntryList);
    const selectedEntry = useSelector(selectCurrentEntry);

    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    useEffect(() => {
        setPage(0)
    }, [employee, list, sort]);

    useEffect(() => {
        setPage(0);
        if (date) {
            dispatch(loadEntries(date))
        }
    }, [employee]);

    const rowsPerPageChangeHandler = (rpp: number) => {
        setPage(0);
        setRowsPerPage(rpp);
    }

    const onSelectEntry = (entry: Entry) => {
        dispatch(setCurrentEntry(entry));
    }

    const sortChangeHandler = (sort: SortProps) => {
        setPage(0);
        dispatch(setEntriesSort(sort));
    }


    const footerData = list.reduce((pv, cv) => ({
        Minutes: new Decimal(pv.Minutes).add(cv.Minutes).toString(),
        Quantity: new Decimal(pv.Quantity).add(cv.Quantity).toString(),
        AllowedMinutes: new Decimal(pv.AllowedMinutes).add(cv.AllowedMinutes).toString(),
        ratePct: 0
    }), {...initialTotal})

    footerData.ratePct = new Decimal(footerData.Minutes).eq(0) ? 0 : new Decimal(footerData.AllowedMinutes).dividedBy(footerData.Minutes).toString();

    if (!employee) {
        return (<Alert>Select Employee</Alert>)
    }

    const tfoot = (
        <tfoot>
        <tr>
            <th colSpan={4}>Total</th>
            <td className="text-end">{numeral(footerData.Minutes).format('0,0')}</td>
            <td className="text-end">{numeral(footerData.Quantity).format('0,0')}</td>
            <td colSpan={4}>&nbsp;</td>
            <td className="text-end">{numeral(footerData.ratePct).format('0,0.0%')}</td>
        </tr>
        </tfoot>
    )

    return (
        <div>
            <h4>Employee Entries - {employee.FullName || 'Select Employee'}</h4>
            {loading && <ProgressBar striped={true} animated={true}/>}
            <SortableTable fields={entryTableFields}
                           data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                           currentSort={sort} onChangeSort={sortChangeHandler}
                           size="xs"
                           keyField="id"
                           selected={selectedEntry?.id}
                           onSelectRow={onSelectEntry}
                           rowClassName={rowClassName} tfoot={tfoot}/>
            <TablePagination page={page} onChangePage={setPage}
                             rowsPerPage={rowsPerPage} onChangeRowsPerPage={rowsPerPageChangeHandler}
                             count={list.length}/>
        </div>
    );
}

export default SLCEmployeeEntries;
