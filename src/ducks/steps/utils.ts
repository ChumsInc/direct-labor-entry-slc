import {SortProps} from "chums-components";
import {DLStep} from "chums-types";

export const stepSorter = (sort: SortProps<DLStep>) => (a: DLStep, b: DLStep) => {
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
