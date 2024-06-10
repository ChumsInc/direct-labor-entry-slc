import {SortProps} from "chums-components";
import {MinimalStep} from "../common-types";
import {DLBasicStep, DLStep} from "chums-types";

export type SortFn<T> = (a:T, b:T) => number;

export function stepSorter<T = MinimalStep>(sort:SortProps<T>):SortFn<T>;
export function stepSorter(sort: SortProps<MinimalStep|DLBasicStep|DLStep>) {
    return (a: MinimalStep, b: MinimalStep) => {
        const {field, ascending} = sort;
        const sortMod = ascending ? 1 : -1;
        switch (field) {
            case 'stepCode':
            case 'description':
            case 'workCenter':
                return (a[field].toLowerCase() === b[field].toLowerCase()
                        ? a.id - b.id
                        : (a[field].toLowerCase() > b[field].toLowerCase() ? 1 : -1)
                ) * sortMod;
            default:
                return (a.id - b.id) * sortMod;
        }
    }
}
