//! Paraclete.Object
(function (Paraclete) {
    'use strict';
    /*jslint nomen:true*/

    /*global
     Paraclete
     */

    Paraclete.Object = Paraclete.Class.extend({
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
         * @param {string} path string traverse this path to find the value
         * @returns {*} value or undefined
         */
        get: function (path) {
            return Paraclete.Traverse.getP(this, path);
        },
        /**
         * set value in path
         * @param {string} path string traverse this path to find the value
         * @param {*} value * overwrite found value
         * @returns {*} value
         */
        set: function (path, value) {
            return Paraclete.Traverse.setP(this, path, value);
        },

        /**
         * Adds an observer for path
         * @param path {string} path to observed property
         * @param onChanged {function} function to call on change
         * @returns {*} id of the added observer
         */
        observe: function (path, onChanged) {
            var observationId = Paraclete.getId();

            if (typeof path === 'function') {
                onChanged = path;
                path = '';
            }
            if (this._meta.observations[path] === undefined) {
                this._meta.observations[path] = [];
            }
            this._meta.observations[path].push({
                id: observationId,
                fn: onChanged
            });

            return observationId;
        },

        /**
         * Removes an observer with the given id.
         * If no id is given, remove all observers
         * @param id
         * @returns {boolean} if something was removed
         */
        ignore: function (id) {
            if (!id) {
                this._meta.observations = {};
                return true;
            }

            var ignored = false,
                observation,
                observationKey,
                i,
                o;

            for (observationKey in this._meta.observations) {
                if (this._meta.observations.hasOwnProperty(observationKey)) {
                    observation = this._meta.observations[observationKey];

                    for (i = 0; i < observation.length; i += 1) {
                        o = observation[i];
                        if (o.id === id) {

                            this._meta.observations[observationKey].splice(i, 1);
                            ignored = true;

                            return ignored;
                        }
                    }

                }
            }


            return ignored;
        }
    });

})(Paraclete);