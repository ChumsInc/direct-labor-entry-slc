import type {AnalysisTotal} from "@/ducks/analysis/components/types";
import {type DataTableField, DataTableRow, useTableContext} from "@chumsinc/sortable-tables";
import type {ReportData} from "@/ducks/reports/types.ts";

interface ReportTFoot {
    totals: AnalysisTotal,
}

export default function AnalysisReportTFoot({totals}: ReportTFoot) {
    const {fields} = useTableContext<ReportData>();
    const data: ReportData = totals as ReportData;
    const totalFields: DataTableField<ReportData>[] = [
        {field: 'idEntries', title: 'Total', render: () => 'Total',},
        ...(fields.slice(1))
    ]
    return (
        <tfoot>
        <DataTableRow<ReportData> fields={totalFields}
                                  row={data}/>
        </tfoot>
    )
};
