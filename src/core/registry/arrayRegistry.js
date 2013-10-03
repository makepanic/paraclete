//! Paraclete.KeyRegistry
(function (Paraclete) {
    'use strict';
    /*jslint nomen:true*/

    /*global
     Paraclete,
     console
     */

    Paraclete.ArrayRegistry = Paraclete.Class.extend({
        _store: {},

        add: function (key, value) {
            var id;

            if (!Paraclete.Type.is('none', key)) {

                if (this._store.hasOwnProperty(key)) {
                    this._store[key] = [];
                }

                id = Paraclete.getId();
                this._store[key].push({
                    val: value,
                    id: id
                });
            }

            return id;
        },

        find: function (key) {
            var found,
                store;

            if (!Paraclete.Type.is('none', key)) {
                if (this._store.hasOwnProperty(key)) {
                    // has key in store
                    found = this._store[key];
                } else {
                    // this key doesn't exist in store
                    console.warn('[Paraclete.ArrayRegistry:find] key not found' + key);
                }
            } else {
                // no key given, return everything

                found = [];

                for (store in this._store) {
                    if (this._store.hasOwnProperty(store)){
                        found = found.concat(this._store[store]);
                    }
                }
            }

            return found;
        }
    });

}(Paraclete));