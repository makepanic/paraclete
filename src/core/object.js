//! Paraclete.Object
(function (Paraclete) {
    'use strict';
    /*jslint nomen:true*/

    /*global
     Paraclete
     */

    Paraclete.Object = Paraclete.Observable.extend({

        /**
         * increments property by 1 or a given amount
         * @param property
         * @param incAmount
         * @returns {*}
         */
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

        /**
         * decrements property by 1 or a given amount
         * @param property
         * @param incAmount
         * @returns {*}
         */
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

        /**
         * toggles a property if it has a boolean value
         * @param property
         * @returns {*}
         */
        toggle: function (property) {
            var prop = this.get(property);
            if (Paraclete.Type.is('boolean', prop)) {
                prop = this.set(property, !prop);
            }
            return prop;
        }
    });

})(Paraclete);