import {subBusinessDays} from 'date-fns'

export const previousSLCWorkDay = ():string => {
    let date = subBusinessDays(new Date(), 1);
    return new Date(date).toISOString();
};
