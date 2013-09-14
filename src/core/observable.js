//! Paraclete.Object
(function (Paraclete) {
    'use strict';
    /*jslint nomen:true*/

    /*global
     Paraclete
     */

    Paraclete.Observable = Paraclete.RootObject.extend({
        _meta: {
            observations: {}
        },

        /**
         * Adds an observer for path
         * @param path {string|Array} path or array of paths to observed property
         * @param onChanged {function} function to call on change
         * @returns {*} id or array of ids of the added observer
         */
        observe: function (path, onChanged) {
            var observationId,
                i,
                ids = [];

            if (Paraclete.Type.is('array', path)) {
                for (i = 0; i < path.length; i += 1) {
                    ids.push(this.observe(path[i], onChanged));
                }
                return ids;
            }

            observationId = Paraclete.getId();

            if (Paraclete.Type.is('function', path)) {
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
            var ignored = false,
                ignoredItem = false,
                observation,
                observationKey,
                i,
                j,
                o;

            if (!id) {
                this._meta.observations = {};
                return true;
            }

            // check if first parameter is an array
            if (Paraclete.Type.is('array', id)) {
                // if it's an array loop through it and call ignore with each array item
                for (j = 0; j < id.length; j += 1) {
                    ignoredItem = false;
                    ignoredItem = this.ignore(id[j]);
                    ignored = ignored && ignoredItem;
                }
                return ignored;
            }

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