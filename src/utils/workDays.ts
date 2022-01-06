import {subBusinessDays} from 'date-fns'

export const previousSLCWorkDay = ():string => {
    let date = subBusinessDays(new Date(), 1);
    return new Date(date).toISOString();
};

export const previousHurricaneWorkDay = ():string => {
    let date = subBusinessDays(new Date(), 1);
    if (date.getDay() === 5) {
        date = subBusinessDays(date, 1);
    }
    return new Date(date).toISOString();
};
