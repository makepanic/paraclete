//! Paraclete.KeyRegistry
(function (Paraclete) {
    'use strict';
    /*jslint nomen:true*/

    /*global
     Paraclete
     */

    /**
     * Same as registry, but knows what property is used as identifier for a value.
     * @see {@link Paraclete.Registry}
     * @type {*}
     */
    Paraclete.KeyRegistry = Paraclete.Registry.extend({
        key: '',

        /**
         * @constructor
         * @param {{ key: String }} cfg configuration
         */
        init: function (cfg) {
            this.key = cfg.key;
        },

        /**
         * Adds a value to the registry
         * @param {*} value
         * @returns {undefined|*} value if added
         */
        add: function (value) {
            var added;

            if (!Paraclete.Type.is('none', value[this.key])) {
                added = this._super(value[this.key], value);
            }

            return added;
        },

        /**
         * Tries to find a value in the registry.
         * @param {*} value
         * @returns {undefined|*} value if found
         */
        find: function (value) {
            var found;

            if (!Paraclete.Type.is('none', value[this.key])) {
                found = this._super(value[this.key]);
            }

            return found;
        },

        /**
         * Removes value from registry.
         * @param {*} value
         * @returns {undefined|*} value if deleted
         */
        remove: function (value) {
            var removed;

            if (!Paraclete.Type.is('none', value[this.key])) {

                removed = value;
                this._super(value[this.key]);
            }

            return removed;
        }
    });

}(Paraclete));