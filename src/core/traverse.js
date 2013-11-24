//! Paraclete.Traverse
(function (Paraclete) {
    'use strict';
    /*jslint nomen:true*/
    /*global
     Paraclete
     */

    var traversePathGet,
        traversePathSet,
        callObserver,
        createObserverCallFunction;

    /**
     * creates a function that calls a given observer with a scope and given values
     * @param {Object} rootObj
     * @param {{fn: Function}} observer
     * @param {*} property
     * @param {*} value
     * @returns {Function}
     */
    createObserverCallFunction = function (rootObj, observer,  property, value) {
        return function () {
            observer.fn.apply(rootObj, [property, value]);
        };
    };

    /**
     * Creates function to execution the stored observer with arguments
     * @param {Object} rootObj
     * @param {String} fullPath
     * @param {*} value
     * @param property
     * @returns {Array}
     */
    callObserver = function (rootObj, fullPath, value, property) {
        var i,
            observers,
            observerCalls = [];

        // check if rootObj has meta and meta observations for fullPath
        if (rootObj._meta && rootObj._meta.observations[fullPath]) {

            // pick observation for fullPath
            observers = rootObj._meta.observations[fullPath];

            // loop through every observer
            for (i = 0; i < observers.length; i += 1) {

                // create callbacks for all observers
                observerCalls.push(createObserverCallFunction(rootObj, observers[i], property, value));
            }
        }

        return observerCalls;
    };

    /**
     * @see {@link Paraclete.Traverse.getP}
     * @param {Object} obj
     * @param {String} path
     * @returns {*}
     */
    traversePathGet = function (obj, path) {
        var nextSplit = path.split('.'),
            next,
            result;

        // split path into parts
        if (nextSplit.length) {

            // take first element from path elements
            next = nextSplit[0];
            nextSplit = nextSplit.slice(1);

            // check if obj has next key
            if (obj[next] !== undefined) {

                // check if there is something left for the next path part
                if (nextSplit.length >= 1) {

                    // call get with object with the next key and path after next key
                    result = traversePathGet(obj[next], nextSplit.join('.'));

                } else {
                    // reached the end of the path

                    // check if last value is a function
                    if (Paraclete.Type.is('function', obj[next])) {

                        // execute function and store result
                        result = obj[next]();
                    } else {

                        // store value in result
                        result = obj[next];
                    }
                }
            }
        }

        return result;
    };

    /**
     * Traverses a path on a object and sets a value
     * @see {@link Paraclete.Traverse.setP}
     * @param {Object} obj
     * @param {String} path
     * @param {*} value
     * @param {String} [fullPath]
     * @param {Object} [rootObj]
     * @param {Array} [digested]
     * @param {Array} [observerCalls]
     * @returns {*}
     */
    traversePathSet = function (obj, path, value, fullPath, rootObj, digested, observerCalls) {
        var nextSplit,
            next,
            result,
            i,
            canObserve;

        // check if observerCalls exist and initialize with empty array if not
        if (!observerCalls) {
            observerCalls = [];
        }

        // check if fullPath exists
        if (!fullPath) {
            // initialize fullPath with given path
            fullPath = path;
        }

        // check if rootObj exists
        if (!rootObj) {
            // initialize rootObj with obj
            rootObj = obj;
        }

        // check if rootObj ist observable
        canObserve = rootObj instanceof Paraclete.Observable;

        // check if digested exists and initialize with empty array if not
        if (!digested) {
            digested = [];

            if (canObserve) {
                observerCalls = observerCalls.concat(callObserver(rootObj, '', value, path));
            }
        }

        // split path into parts
        nextSplit = path.split('.');

        // check if parts have elements
        if (nextSplit.length) {

            // pick first element of next path
            next = nextSplit[0];

            // add picked value to digested array
            digested.push(next);

            // remove the first element from next paths
            nextSplit = nextSplit.slice(1);

            // check if there are more path elements
            if (nextSplit.length > 0) {
                // has more to traverse

                if (canObserve) {
                    // add observer call to observerCalls array
                    observerCalls = observerCalls.concat(callObserver(rootObj, digested.join('.'), value, nextSplit.join('.')));
                }

                // call set from current path object
                result = traversePathSet(obj[next], nextSplit.join('.'), value, fullPath, rootObj, digested, observerCalls);

            } else {
                // reached the end

                if (canObserve) {
                    // add observer call for last element
                    observerCalls = observerCalls.concat(callObserver(rootObj, fullPath, value, ''));
                }

                // set path value and result value
                result = obj[next] = value;

                if (canObserve) {
                    // loop through each observer call and execute
                    for (i = 0; i < observerCalls.length; i += 1) {
                        observerCalls[i]();
                    }
                }
            }
        }

        return result;
    };

    Paraclete.Traverse = {
        /**
         * Gets a value on a object traversing a path
         * @param {Object} obj
         * @param {String} path Path to traverse
         * @returns {*} stored value or undefined
         */
        getP: function (obj, path) {
            return traversePathGet(obj, path);
        },
        /**
         * Sets a value on an object traversing a path
         * @param {Object} obj
         * @param {String} path
         * @param {*} val
         * @returns {*} value that was stored
         */
        setP: function (obj, path, val) {
            return traversePathSet(obj, path, val);
        }
    };

})(Paraclete);