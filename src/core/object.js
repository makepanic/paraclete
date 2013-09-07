//! Paraclete.Object
(function (Paraclete) {
    'use strict';
    /*jslint nomen:true*/

    /*global
     Paraclete
     */

    var Object = Paraclete.Class.extend({
        _meta: {
            observations: {}
        },

        init: function (props) {
            if (props) {
                var prop;

                for (prop in props) {
                    if (props.hasOwnProperty(prop)) {
                        this[prop] = props[prop];
                    }
                }
            }
        },

        /**
         * get value from path
         * @param path string traverse this path to find the value
         * @returns {*} value or undefined
         */
        get: function (path) {
            return Paraclete.Traverse.getP(this, path);
        },
        /**
         * set value in path
         * @param path string traverse this path to find the value
         * @param value * overwrite found value
         * @returns {*} value
         */
        set: function (path, value) {
            return Paraclete.Traverse.setP(this, path, value);
        },

        observe: function (prop, onChanged) {
            if(typeof prop === 'function'){
                onChanged = prop;
                prop = '';
            }
            if (this._meta.observations[prop] === undefined) {
                this._meta.observations[prop] = [];
            }
            this._meta.observations[prop].push(onChanged);
        }
    });

    Paraclete.Object = Object;

})(Paraclete);