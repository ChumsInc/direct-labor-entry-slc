export const now = () => new Date().valueOf();

export const inputDate = (d:Date) => {
    if (!d) {
        return d;
    }
    return new Date(d.valueOf() + new Date().getTimezoneOffset() * 60 * 1000);
}
