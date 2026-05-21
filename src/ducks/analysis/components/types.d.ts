import type {DataTableField} from "@chumsinc/sortable-tables";
import type {ReportData} from "@/ducks/analysis/types.ts";

export interface AnalysisTotal {
    Minutes: number | string,
    AllowedMinutes: number | string,
    Quantity: number | string,
    Rate: number | string,
    UPH: number | string,
}

export interface AnalysisField<T = ReportData> extends DataTableField<T> {
    total?: boolean;
}


export type FieldDefinitionRecord = Record<keyof ReportData, AnalysisField>;

