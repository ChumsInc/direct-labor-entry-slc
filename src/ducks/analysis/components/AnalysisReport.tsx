import {startTransition, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ContainedSortableTable, type SortProps, TablePagination, useTableContext,} from "@chumsinc/sortable-tables";
import type {ReportData} from "../types.ts";
import {selectAllGroupBy, selectSortedData} from "../selectors.ts";
import {between, MAX_DANGER, MAX_SUCCESS, MIN_DANGER, MIN_SUCCESS} from "../../entries/utils.ts";
import {ErrorBoundary} from 'react-error-boundary'
import ErrorBoundaryFallbackAlert from "@/components/ErrorBoundaryFallbackAlert.tsx";
import {setReportSort} from "../actions.ts";
import {calcTotals} from "@/ducks/analysis/components/utils.ts";
import {getGroupFields} from "@/ducks/analysis/components/group-fields.tsx";
import AnalysisReportTFoot from "@/ducks/analysis/components/AnalysisReportTFoot.tsx";


const rowClassName = (row: ReportData) => {
    return {
        'table-danger': !between(row.Rate, [MIN_DANGER, MAX_DANGER]),
        'table-warning': between(row.Rate, [MIN_DANGER, MAX_DANGER]) && !between(row.Rate, [MIN_SUCCESS, MAX_SUCCESS]),
        'table-success': between(row.Rate, [MIN_SUCCESS, MAX_SUCCESS]),
    }
};

const AnalysisReport = () => {
    const {setFields, sort} = useTableContext<ReportData>();
    const dispatch = useDispatch();
    const data = useSelector(selectSortedData);
    const grouping = useSelector(selectAllGroupBy);

    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(25)

    useEffect(() => {
        startTransition(() => {
            setPage(0);
        })
    }, [data, sort]);

    useEffect(() => {
        setFields(getGroupFields(grouping));
    }, [grouping, setFields]);


    const sortChangeHandler = (sort: SortProps<ReportData>) => {
        setPage(0);
        dispatch(setReportSort(sort));
    }

    const rowsPerPageChangeHandler = (rpp: number) => {
        setPage(0);
        setRowsPerPage(rpp);
    }

    const totals = calcTotals(data);

    return (
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallbackAlert}>
            <ContainedSortableTable keyField="idEntries"
                                    onChangeSort={sortChangeHandler}
                                    data={data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                                    size="xs"
                                    tfoot={<AnalysisReportTFoot totals={totals}/>}
                                    rowClassName={rowClassName}/>
            <TablePagination page={page} onChangePage={setPage}
                             rowsPerPage={rowsPerPage} rowsPerPageProps={{onChange: rowsPerPageChangeHandler}}
                             count={data.length}/>
        </ErrorBoundary>
    )
}


export default AnalysisReport;

