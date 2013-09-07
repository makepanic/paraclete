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

            if (obj[next]) {
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
            observers;

        if (rootObj._meta && rootObj._meta.observations[fullPath]) {
            observers = rootObj._meta.observations[fullPath];
            for (i = 0; i < observers.length; i += 1) {
                observers[i].fn.apply(null, [property, value]);
            }
        }
    };

    traversePathSet = function (obj, path, value, fullPath, rootObj, digested) {
        if (!fullPath) {
            fullPath = path;
        }
        if (!rootObj) {
            rootObj = obj;
        }
        if (!digested) {
            digested = [];
            callObserver(rootObj, digested.join('.'), value, path);
        }

        var nextSplit,
            next,
            result;

        nextSplit = path.split('.');

        if (nextSplit.length) {
            next = nextSplit[0];
            digested.push(next);
            nextSplit = nextSplit.slice(1);

            if (nextSplit.length > 0) {
                // has more to traverse
                callObserver(rootObj, digested.join('.'), value, nextSplit.join('.'));
                result = traversePathSet(obj[next], nextSplit.join('.'), value, fullPath, rootObj, digested);
            } else {
                // nothing left to traverse
                callObserver(rootObj, fullPath, value, '');
                result = obj[next] = value;
            }
        }

        return result;
    };

    Paraclete.Traverse = {
        getP: traversePathGet,
        setP: traversePathSet
    };

})(Paraclete);