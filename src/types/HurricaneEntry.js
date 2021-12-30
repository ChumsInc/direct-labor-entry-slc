import {previousHurricaneWorkDay} from '../utils/workDays'


export default class HurricaneEntry {

    id = 0;
    EmployeeNumber = '';
    FullName = '';
    EntryDate = null;
    LineNo = 1;
    idSteps = 0;
    StepCode = '';
    Minutes = 0;
    Quantity = 0;
    StandardAllowedMinutes = 0;
    Description = '';
    timestamp = '';
    classNames = '';

    constructor(props = {}) {
        Object.keys(props).map(key => {
            if (key in this) {
                this[key] = props[key];
            }
        });
    }

    get key() {
        return this.id;
    }

    get rate() {
        return this.Quantity === 0 ? 0 : (this.Minutes / this.Quantity);
    }

    get isRateTooLow() {
        return this.rate < (this.StandardAllowedMinutes * 0.9);
    }

    get isRateTooHigh() {
        return this.StandardAllowedMinutes > 0 && this.rate > (this.StandardAllowedMinutes * 1.1);
    }

    get isOutOfLimits() {
        return this.StandardAllowedMinutes > 0
            && (this.rate > (this.StandardAllowedMinutes * 1.5) || this.rate < (this.StandardAllowedMinutes * 0.5));
    }

    get allowedMinutes() {
        return this.Quantity * this.StandardAllowedMinutes;
    }

    get requiredQuantity() {
        return this.StandardAllowedMinutes === 0 ? 0 : (this.Minutes / this.StandardAllowedMinutes);
    }

    get StandardUPH() {
        return this.StandardAllowedMinutes === 0 ? 0 : (60 / this.StandardAllowedMinutes);
    }

    get UPH() {
        return this.rate === 0 ? 0 : (60 / this.rate);
    }

    get ratePct() {
        return this.StandardAllowedMinutes === 0 ? 0 : (this.UPH / this.StandardUPH);
    }

    static previousWorkDay = () => {
        return previousHurricaneWorkDay();
    }
}
