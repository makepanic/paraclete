//! Paraclete.Object
(function (Paraclete) {
    'use strict';

    var types,
        checkFn;

    checkFn = function (val) {
        return Object.prototype.toString.call(val);
    };

    types = {
        /**
         * Checks if a value is an array
         * @param val {*}
         * @returns {boolean}
         */
        'array': function (val) {
            return checkFn(val) === '[object Array]';
        },
        /**
         * Checks if a value is a function
         * @param val {*}
         * @returns {boolean}
         */
        'function': function (val) {
            return checkFn(val) === '[object Function]';
        },

        /**
         * Checks if a value is a number
         * @param val
         * @returns {boolean}
         */
        'number': function (val) {
            return !isNaN(val) && checkFn(val) === '[object Number]';
        },

        /**
         * Checks if a value is a string
         * @param val
         * @returns {boolean}
         */
        'string': function (val) {
            return checkFn(val) === '[object String]';
        },

        /**
         * Checks if a value is a object
         * @param val
         * @returns {boolean}
         */
        'object': function (val) {
            return checkFn(val) === '[object Object]';
        }
    };

    Paraclete.Type = {
        /**
         * Checks if a value is of a given type
         * @param type {string}
         * @param value {*}
         * @returns {*} true if is of type
         */
        is: function (type, value) {
            var is;
            if (types.hasOwnProperty(type)) {
                is = types[type](value);
            }
            return is;
        }
    };

})(Paraclete);