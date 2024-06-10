import {KeyedObject} from "../ducks/common-types";

export function searchParams(arg:KeyedObject):URLSearchParams {
    const params = new URLSearchParams();
    Object.keys(arg).filter(key => typeof arg[key] !== 'undefined')
        .forEach(key => {
            const value = arg[key];
            switch (typeof value) {
                case 'string':
                case 'number':
                case 'bigint':
                case 'boolean':
                    params.set(key, String(value));
            }
        })
    return params;
}
