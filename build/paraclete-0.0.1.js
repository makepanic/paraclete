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
var Paraclete = {
    v: '0.0.1'
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
    //noinspection JSLint
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
            if (this._meta.observations[prop] === undefined) {
                this._meta.observations[prop] = [];
            }
            this._meta.observations[prop].push(onChanged);
        }
    });

    Paraclete.Object = Object;

})(Paraclete);
    return Paraclete;
}));