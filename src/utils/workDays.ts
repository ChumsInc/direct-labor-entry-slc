import {subBusinessDays} from 'date-fns'

export const previousSLCWorkDay = ():string => {
    const date = subBusinessDays(new Date(), 1);
    return new Date(date).toISOString();
};
