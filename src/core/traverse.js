//! Paraclete.Traverse
(function (Paraclete) {
    'use strict';
    /*jslint nomen:true*/
    /*global
     Paraclete
     */

    var traversePathGet,
        traversePathSet,
        callObserver;

    traversePathGet = function (obj, path) {
        var nextSplit = path.split('.'),
            next,
            result;

        if (nextSplit.length) {
            next = nextSplit[0];
            nextSplit = nextSplit.slice(1);

            if (obj[next] !== undefined) {
                if (nextSplit.length >= 1) {
                    result = traversePathGet(obj[next], nextSplit.join('.'));
                } else {
                    if (Paraclete.Type.is('function', obj[next])) {
                        result = obj[next]();
                    } else {
                        result = obj[next];
                    }
                }
            }
        }

        return result;
    };

    callObserver = function (rootObj, fullPath, value, property) {
        var i,
            observers,
            observerCalls = [];

        if (rootObj._meta && rootObj._meta.observations[fullPath]) {
            observers = rootObj._meta.observations[fullPath];
            for (i = 0; i < observers.length; i += 1) {
                observerCalls.push(
                    (function (observers, i, property, value) {
                        return function () {
                            observers[i].fn.apply(rootObj, [property, value]);
                        };
                    })(observers, i, property, value)
                );
            }
        }

        return observerCalls;
    };

    traversePathSet = function (obj, path, value, fullPath, rootObj, digested, observerCalls) {
        var nextSplit,
            next,
            result,
            i,
            canObserve;

        if (!observerCalls) {
            observerCalls = [];
        }
        if (!fullPath) {
            fullPath = path;
        }
        if (!rootObj) {
            rootObj = obj;
        }
        canObserve = rootObj instanceof Paraclete.Observable;

        if (!digested) {
            digested = [];

            if (canObserve) {
                observerCalls = observerCalls.concat(callObserver(rootObj, '', value, path));
            }
        }

        nextSplit = path.split('.');

        if (nextSplit.length) {
            next = nextSplit[0];
            digested.push(next);
            nextSplit = nextSplit.slice(1);

            if (nextSplit.length > 0) {
                // has more to traverse

                if (canObserve) {
                    observerCalls = observerCalls.concat(callObserver(rootObj, digested.join('.'), value, nextSplit.join('.')));
                }
                result = traversePathSet(obj[next], nextSplit.join('.'), value, fullPath, rootObj, digested, observerCalls);
            } else {
                // nothing left to traverse
                if (canObserve) {
                    observerCalls = observerCalls.concat(callObserver(rootObj, fullPath, value, ''));
                }

                result = obj[next] = value;

                if (canObserve) {
                    for (i = 0; i < observerCalls.length; i += 1) {
                        observerCalls[i]();
                    }
                }
            }
        }

        return result;
    };

    Paraclete.Traverse = {
        getP: traversePathGet,
        setP: traversePathSet
    };

})(Paraclete);