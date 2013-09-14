//! Paraclete.Object
(function (Paraclete) {
    'use strict';
    /*jslint nomen:true*/

    /*global
     Paraclete
     */

    Paraclete.Object = Paraclete.Observable.extend({

        inc: function (property, incAmount) {
            var amount = 1,
                oldVal,
                newVal;

            if (Paraclete.Type.is('number', incAmount)) {
                amount = incAmount;
            }

            oldVal = this.get(property);
            if (Paraclete.Type.is('number', oldVal)) {
                newVal = this.set(property, oldVal + amount);
            }

            return newVal;
        },

        dec: function (property, incAmount) {
            var amount = 1,
                oldVal,
                newVal;

            if (Paraclete.Type.is('number', incAmount)) {
                amount = incAmount;
            }

            oldVal = this.get(property);

            if (Paraclete.Type.is('number', oldVal)) {
                newVal = this.set(property, oldVal - amount);
            }

            return newVal;
        },

        toggle: function (property) {
            var prop = this.get(property);
            if (Paraclete.Type.is('boolean', prop)) {
                prop = this.set(property, !prop);
            }
            return prop;
        }
    });

})(Paraclete);