export default class Employee {
    EmployeeNumber = '';
    FirstName = '';
    LastName = '';
    FullName = '';
    Department = '';
    active = false;

    constructor(props = {}) {
        Object.keys(props).map(key => {
            if (key in this) {
                this[key] = props[key];
            }
        });
    }

    get id() {
        return this.EmployeeNumber;
    }

    get key() {
        return this.EmployeeNumber;
    }

    get Name() {
        return this.FullName;
    }
}
