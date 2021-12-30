/**
 * Created by steve on 10/3/2016.
 */
'use strict';

export default class Extendable {
    constructor(obj = {}) {
        let key;
        for (key in this) {
            if (obj[key] !== undefined) {
                this[key] = obj[key];
            }
        }
        // Object.keys(obj).map(key => {
        //     console.log('extendable? ', key, key in self);
        //     if (key in self) {
        //         try {
        //             console.log('Extendable()', key, obj[key]);
        //             self[key] = obj[key];
        //         } catch(ex) {
        //             console.log('Extendable()', key, ex);
        //         }
        //
        //     }
        // });
    }
}