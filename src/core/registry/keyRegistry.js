//! Paraclete.KeyRegistry
(function (Paraclete) {
    'use strict';
    /*jslint nomen:true*/

    /*global
     Paraclete
     */

    Paraclete.KeyRegistry = Paraclete.Registry.extend({
        key: '',

        init: function (cfg) {
            this.key = cfg.key;
        },

        add: function (value) {
            var added;

            if (!Paraclete.Type.is('none', value[this.key])) {
                added = this._super(value[this.key], value);
            }

            return added;
        },

        find: function (value) {
            var found;

            if (!Paraclete.Type.is('none', value[this.key])) {
                found = this._super(value[this.key]);
            }

            return found;
        },

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