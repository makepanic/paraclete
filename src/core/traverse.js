//! Paraclete.Traverse
(function (Paraclete) {
    'use strict';
    /*jslint nomen:true*/
    /*global
     Paraclete
     */

    var traversePathGet,
        traversePathSet;

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
                    if (typeof obj[next] === 'function') {
                        result = obj[next]();
                    } else {
                        result = obj[next];
                    }
                }
            }
        }

        return result;
    };

    traversePathSet = function (obj, path, value, fullPath) {
        if (!fullPath) {
            fullPath = path;
        }

        var nextSplit,
            next,
            result,
            i;

        nextSplit = path.split('.');

        if (nextSplit.length) {
            next = nextSplit[0];
            nextSplit = nextSplit.slice(1);

            if (nextSplit.length > 0) {
                result = traversePathSet(obj[next], nextSplit.join('.'), value, fullPath);
            } else {
                // am ende angekommen

                if (obj._meta && obj._meta.observations[fullPath]) {
                    for (i = 0; i < obj._meta.observations[fullPath].length; i += 1) {
                        obj._meta.observations[fullPath][i].apply(null, [fullPath, value]);
                    }
                }

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