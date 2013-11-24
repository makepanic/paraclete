//! Paraclete.Registry
(function (Paraclete) {
    'use strict';

    /*jslint nomen:true*/

    /*global
     Paraclete
     */

    /**
     * Key value storage for values
     * @type {*}
     */
    Paraclete.Registry = Paraclete.Class.extend({
        _store: {},

        /**
         * Adds a value using a key to the storage
         * @param {String} key identifier where to store the value
         * @param {*} value
         * @returns {*} value if added
         */
        add: function (key, value) {
            var added;

            if (!Paraclete.Type.is('none', key)) {
                this._store[key] = value;
                added = value;
            }

            return added;
        },

        /**
         * Finds a value in the storage using the given key
         * @param {String} key
         * @returns {*} stored value if found
         */
        find: function (key) {
            var found;

            if (!Paraclete.Type.is('none', key)) {
                found = this._store[key];
            }

            return found;
        },

        /**
         * Removes value stored under key
         * @param {String} key
         * @returns {*} value if removed
         */
        remove: function (key) {
            var removed;

            if (!Paraclete.Type.is('none', key)) {
                removed = this._store[key];
                delete this._store[key];
            }

            return removed;
        }
    });

}(Paraclete));