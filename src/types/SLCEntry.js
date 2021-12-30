import {previousSLCWorkDay} from '../utils/workDays'

export default class SLCEntry {

    id = 0;
    EmployeeNumber = '';
    WorkCenter = '';
    FullName = '';
    EntryDate = null;
    LineNo = 0;
    idSteps = 0;
    StepCode = '';
    Minutes = 0;
    Quantity = 0;
    StandardAllowedMinutes = 0;
    AllowedMinutes = 0;
    UPH = 0;
    StdUPH = 0;
    Description = '';
    DocumentNo = '';
    DocumentType = '';
    ItemCode = '';
    WarehouseCode = '';

    Company = 'chums';
    WorkOrderNo = '';
    OperationCode = '';
    PlannedPieceCostDivisor = 1;
    OperationDescription = '';
    timestamp = '';
    saving = false;

    constructor(props = {}) {
        Object.keys(props).map(key => {
            if (key in this) {
                this[key] = props[key];
            }
        });
        this.OperationDescription = props.Description || this.OperationDescription;
        this.OperationCode = props.StepCode || this.OperationCode;
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

    // get UPH() {
    //     return this.rate === 0 ? 0 : (60 / this.rate);
    // }

    get ratePct() {
        return this.StdUPH === 0 ? 0 : (this.UPH / this.StdUPH);
    }

    static previousWorkDay = () => {
        return previousSLCWorkDay();
    }

}
