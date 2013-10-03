//! Paraclete.Registry
(function (Paraclete) {
    'use strict';

    /*jslint nomen:true*/

    /*global
     Paraclete
     */

    Paraclete.Registry = Paraclete.Class.extend({
        _store: {},

        add: function (key, value) {
            var added;

            if (!Paraclete.Type.is('none', key)) {
                this._store[key] = value;
                added = value;
            }

            return added;
        },

        find: function (key) {
            var found;

            if (!Paraclete.Type.is('none', key)) {
                found = this._store[key];
            }

            return found;
        },

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