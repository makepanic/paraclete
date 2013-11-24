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

        /**
         * Adds a value to the store for key
         * @param {String} key
         * @param {*} value
         * @returns {Number} id of added value
         */
        add: function (key, value) {
            var id;

            if (!Paraclete.Type.is('none', key)) {
                if (!this._store.hasOwnProperty(key)) {
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

        /**
         * Removes value with given id from storage
         * @param {Number} id
         * @returns {*} stored value if found
         */
        remove: function (id) {
            var storeAtom,
                storeAtomElem,
                i,
                removed;

            for (storeAtom in this._store) {
                if (this._store.hasOwnProperty(storeAtom)) {
                    for (i = 0; i < this._store[storeAtom].length; i += 1) {
                        storeAtomElem = this._store[storeAtom][i];
                        if (storeAtomElem.id === id) {
                            // found element
                            removed = storeAtomElem.val;
                            this._store[storeAtom].splice(i, 1);
                        }
                    }
                }
            }

            return removed;
        },

        /**
         * Returns all values that are stored under a given key
         * @param {String} key
         * @returns {undefined|Array}
         */
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