import {subBusinessDays} from 'date-fns'

export const previousSLCWorkDay = ():Date => {
    let date = subBusinessDays(new Date(), 1);
    return new Date(date);
};

export const previousHurricaneWorkDay = ():Date => {
    let date = subBusinessDays(new Date(), 1);
    if (date.getDay() === 5) {
        date = subBusinessDays(date, 1);
    }
    return new Date(date);
};
