/*global
 exports,
 module,
 define,
 window
 */
(function (root, factory) {
    'use strict';

    // CommonJS
    if (typeof exports === 'object' && module) {
        module.exports = factory();

        // AMD
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
        // Browser
    } else {
        root.Paraclete = factory();
    }
}((typeof window === 'object' && window) || this, function () {
/*jslint nomen:true*/
/*global
 Paraclete
 */
var Paraclete = {
    v: '0.0.1',
    _id: 0,
    getId: function () {
        'use strict';

        Paraclete._id += 1;
        return Paraclete._id;
    }
};
/*jslint sloppy:true*/
//! Paraclete.Class
(function (Paraclete) {

    var initializing,
        Class,
        fnTest;

    /* Simple JavaScript Inheritance
     * By John Resig http://ejohn.org/
     * MIT Licensed.
     */
    // Inspired by base2 and Prototype
    //noinspection JSLint,JSValidateTypes
    initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

    // The base Class implementation (does nothing)
    Class = function(){};

    // Create a new Class that inherits from this class
    Class.extend = function(prop) {
        var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] == "function" &&
                typeof _super[name] == "function" && fnTest.test(prop[name]) ?
                (function(name, fn){
                    return function() {
                        var tmp = this._super;

                        // Add a new ._super() method that is the same method
                        // but on the super-class
                        this._super = _super[name];

                        // The method only need to be bound temporarily, so we
                        // remove it when we're done executing
                        var ret = fn.apply(this, arguments);
                        this._super = tmp;

                        return ret;
                    };
                })(name, prop[name]) :
                prop[name];
        }

        // The dummy class constructor
        function Class() {
            // All construction is actually done in the init method
            if ( !initializing && this.init )
                this.init.apply(this, arguments);
        }

        // Populate our constructed prototype object
        Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        Class.prototype.constructor = Class;

        // And make this class extendable
        Class.extend = arguments.callee;

        return Class;
    };

    Paraclete.Class = Class;

})(Paraclete);
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
//! Paraclete.Object
(function (Paraclete) {
    'use strict';

    var types,
        checkFn;

    checkFn = function (val) {
        return Object.prototype.toString.call(val);
    };

    types = {
        /**
         * Checks if a value is an array
         * @param val {*}
         * @returns {boolean}
         */
        'array': function (val) {
            return checkFn(val) === '[object Array]';
        },
        /**
         * Checks if a value is a function
         * @param val {*}
         * @returns {boolean}
         */
        'function': function (val) {
            return checkFn(val) === '[object Function]';
        },

        /**
         * Checks if a value is a number
         * @param val
         * @returns {boolean}
         */
        'number': function (val) {
            return !isNaN(val) && checkFn(val) === '[object Number]';
        },

        /**
         * Checks if a value is a string
         * @param val
         * @returns {boolean}
         */
        'string': function (val) {
            return checkFn(val) === '[object String]';
        },

        /**
         * Checks if a value is a object
         * @param val
         * @returns {boolean}
         */
        'object': function (val) {
            return checkFn(val) === '[object Object]';
        },

        /**
         * Checks if a value is a boolean
         * @param val
         * @returns {boolean}
         */
        'boolean': function (val) {
            return checkFn(val) === '[object Boolean]';
        }
    };

    Paraclete.Type = {
        /**
         * Checks if a value is of a given type
         * @param type {string}
         * @param value {*}
         * @returns {*} true if is of type
         */
        is: function (type, value) {
            var is;
            if (types.hasOwnProperty(type)) {
                is = types[type](value);
            }
            return is;
        }
    };

})(Paraclete);
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
         * @param path {string|Array} path or array of paths to observed property
         * @param onChanged {function} function to call on change
         * @returns {*} id or array of ids of the added observer
         */
        observe: function (path, onChanged) {
            var observationId = Paraclete.getId(),
                i,
                ids = [];

            if (Paraclete.Type.is('array', path)) {
                for (i = 0; i < path.length; i += 1) {
                    ids.push(this.observe(path[i], onChanged));
                }
                return ids;
            }

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
    return Paraclete;
}));