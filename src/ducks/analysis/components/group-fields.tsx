import type {ReportData, ReportGrouping, ReportGroupingId} from "@/ducks/analysis/types.ts";
import type {AnalysisField} from "@/ducks/analysis/components/types";
import {fieldsDefinitions} from "@/ducks/analysis/components/analysisFields.tsx";
import type {SortableTableField} from "@chumsinc/sortable-tables";

export const groupFields = (group: keyof ReportData): SortableTableField<ReportData>[] => {
    switch (group) {
        case 'WorkCenter':
            return [fieldsDefinitions.WorkCenter];
        case 'EntryDate':
            return [fieldsDefinitions.EntryDate];
        case 'EmployeeNumber':
            return [fieldsDefinitions.FullName];
        case 'StepCode':
            return [fieldsDefinitions.StepCode, fieldsDefinitions.Description];
        case 'DocumentNo':
            return [fieldsDefinitions.DocumentNo, fieldsDefinitions.ItemCode];
        case 'ItemCode':
            return [fieldsDefinitions.ItemCode];
        case 'WarehouseCode':
            return [fieldsDefinitions.WarehouseCode];
        case 'idEntries':
            return [
                fieldsDefinitions.WorkCenter,
                fieldsDefinitions.EntryDate,
                fieldsDefinitions.FullName,
                fieldsDefinitions.DocumentNo,
                fieldsDefinitions.ItemCode,
                fieldsDefinitions.WarehouseCode,
                fieldsDefinitions.StepCode,
                fieldsDefinitions.Description
            ];
        default:
            return [];
    }
}

export function getGroupFields(grouping:ReportGrouping):SortableTableField<ReportData>[] {
    const fields: AnalysisField[] = [];
    Object.keys(grouping)
        .map(key => +key as ReportGroupingId)
        .filter(key => !!grouping[key])
        .forEach(key => {
            const field = grouping[key];
            if (field !== '') {
                fields.push(...groupFields(field));
            }
        })
    if (Object.values(grouping).includes('StepCode')) {
        fields.push(fieldsDefinitions.StandardAllowedMinutes)
    }
    fields.push(fieldsDefinitions.Minutes);
    fields.push(fieldsDefinitions.Quantity);
    fields.push(fieldsDefinitions.AllowedMinutes);
    fields.push(fieldsDefinitions.UPH);

    if (fields.filter(f => f.field === fieldsDefinitions.StepCode.field).length > 0
        && !fields.filter(f => f.field === fieldsDefinitions.UPHStd.field).length) {
        fields.push(fieldsDefinitions.UPHHistoric);
        fields.push(fieldsDefinitions.UPHStd);
    }
    if (!!fields.filter(f => f.field === fieldsDefinitions.StandardAllowedMinutes.field).length
        && !fields.filter(f => f.field === fieldsDefinitions.UPHStd.field).length) {
        fields.push(fieldsDefinitions.UPHStd);
    }
    fields.push(fieldsDefinitions.Rate);
    return fields;
}
