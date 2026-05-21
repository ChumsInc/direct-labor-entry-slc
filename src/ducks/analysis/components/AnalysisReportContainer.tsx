import {DataTableProvider} from "@chumsinc/sortable-tables";
import {useAppSelector} from "@/app/configureStore.ts";
import {selectAllGroupBy, selectReportSort} from "@/ducks/analysis/selectors.ts";
import {useSelector} from "react-redux";
import {getGroupFields} from "@/ducks/analysis/components/group-fields.tsx";
import AnalysisReport from "@/ducks/analysis/components/AnalysisReport.tsx";
import AnalysisFilters from "@/ducks/analysis/components/AnalysisFilters.tsx";

export default function AnalysisReportContainer() {
    const sort = useAppSelector(selectReportSort);
    const grouping = useSelector(selectAllGroupBy);

    return (
        <DataTableProvider initialFields={getGroupFields(grouping)} initialSort={sort} >
            <AnalysisFilters/>
            <div className="mt-4">
                <AnalysisReport/>
            </div>
        </DataTableProvider>
    )

}
