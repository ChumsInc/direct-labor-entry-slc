import dayjs from "dayjs";

export const previousSLCWorkDay = (): string => {
    const day = dayjs();
    return day.day() <= 1
        ? day.subtract(1, 'week').day(5).format('YYYY-MM-DD')
        : day.subtract(1, 'day').format('YYYY-MM-DD');
};
