import type {AnalysisTotal} from "@/ducks/analysis/components/types";
import Decimal from "decimal.js";
import type {ReportData} from "@/ducks/analysis/types.ts";

export const _rate = ({
                          Quantity = 0,
                          Minutes = 0
                      }: Partial<AnalysisTotal>): string | number => {
    return new Decimal(Quantity).eq(0)
        ? 0
        : new Decimal(Minutes).div(Quantity).toString();
}
export const _uph = ({
                         Quantity = 0,
                         Minutes = 0
                     }: Partial<AnalysisTotal>): string | number => {
    return new Decimal(Quantity).eq(0)
        ? 0
        : new Decimal(60).div(_rate({
            Quantity,
            Minutes
        })).toString();
}

export const _ratePct = ({
                             AllowedMinutes = 0,
                             Minutes = 0
                         }: Partial<AnalysisTotal>):string|number => {
    return new Decimal(Minutes).eq(0)
        ? 0
        : new Decimal(AllowedMinutes).div(Minutes).toString();
}

export const totalInit: AnalysisTotal = {
    Minutes: 0,
    AllowedMinutes: 0,
    Quantity: 0,
    Rate: 0,
    UPH: 0,
};

export const calcTotals = (data: ReportData[]):AnalysisTotal => {
    const totals = data.reduce((total: AnalysisTotal, row) => {
        return {
            Quantity: new Decimal(total.Quantity).add(row.Quantity).toString(),
            Minutes: new Decimal(total.Minutes).add(row.Minutes).toString(),
            AllowedMinutes: new Decimal(total.AllowedMinutes).add(row.AllowedMinutes).toString(),
            UPH: 0,
            Rate: 0,
        };
    }, {...totalInit})
    totals.UPH = _uph(totals);
    totals.Rate = _ratePct(totals);
    return totals;
}

