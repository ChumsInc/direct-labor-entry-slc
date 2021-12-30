export default class StepCode {
    id = 0;
    StepCode = '';
    Description = '';
    WorkCenter = '';

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
}
