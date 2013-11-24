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
    /**
     * Generates a unique id on runtime
     * @returns {Number} id
     */
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
         * checks if a value is undefined or null
         * @param val
         * @returns {boolean}
         */
        'none': function(val) {
            return typeof val === "undefined" || val === null;
        },
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
        },

        /**
         * Trys to find a simple type string of a given value
         * @param value
         * @returns {*}
         */
        find: function (value) {
            var found,
                type,
                typeString = '';

            for (type in types) {
                if (types.hasOwnProperty(type)) {
                    found = types[type](value);

                    if (found) {
                        typeString = type;
                        break;
                    }
                }
            }

            return typeString;
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

    Paraclete.RootObject = Paraclete.Class.extend({

        /**
         * Copy all properties from props to this object
         * @param {Object} props
         */
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
         * @param {String} path string traverse this path to find the value
         * @returns {*} value or undefined
         */
        get: function (path) {
            return Paraclete.Traverse.getP(this, path);
        },
        /**
         * set value in path
         * @param {String} path string traverse this path to find the value
         * @param {*} value * overwrite found value
         * @returns {*} value
         */
        set: function (path, value) {
            return Paraclete.Traverse.setP(this, path, value);
        }
    });

})(Paraclete);
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
         * @param {String|Array} path or array of paths to observed property
         * @param {Function} onChanged function to call on change
         * @returns {Number|Array} id or array of ids of the added observer
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
         * @param {Number|Array} id or array of ids
         * @returns {Boolean} if something was removed
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
//! Paraclete.Registry
(function (Paraclete) {
    'use strict';

    /*jslint nomen:true*/

    /*global
     Paraclete
     */

    /**
     * Key value storage for values
     * @type {*}
     */
    Paraclete.Registry = Paraclete.Class.extend({
        _store: {},

        /**
         * Adds a value using a key to the storage
         * @param {String} key identifier where to store the value
         * @param {*} value
         * @returns {*} value if added
         */
        add: function (key, value) {
            var added;

            if (!Paraclete.Type.is('none', key)) {
                this._store[key] = value;
                added = value;
            }

            return added;
        },

        /**
         * Finds a value in the storage using the given key
         * @param {String} key
         * @returns {*} stored value if found
         */
        find: function (key) {
            var found;

            if (!Paraclete.Type.is('none', key)) {
                found = this._store[key];
            }

            return found;
        },

        /**
         * Removes value stored under key
         * @param {String} key
         * @returns {*} value if removed
         */
        remove: function (key) {
            var removed;

            if (!Paraclete.Type.is('none', key)) {
                removed = this._store[key];
                delete this._store[key];
            }

            return removed;
        }
    });

}(Paraclete));
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
//! Paraclete.KeyRegistry
(function (Paraclete) {
    'use strict';
    /*jslint nomen:true*/

    /*global
     Paraclete
     */

    /**
     * Same as registry, but knows what property is used as identifier for a value.
     * @see {@link Paraclete.Registry}
     * @type {*}
     */
    Paraclete.KeyRegistry = Paraclete.Registry.extend({
        key: '',

        /**
         * @constructor
         * @param {{ key: String }} cfg configuration
         */
        init: function (cfg) {
            this.key = cfg.key;
        },

        /**
         * Adds a value to the registry
         * @param {*} value
         * @returns {undefined|*} value if added
         */
        add: function (value) {
            var added;

            if (!Paraclete.Type.is('none', value[this.key])) {
                added = this._super(value[this.key], value);
            }

            return added;
        },

        /**
         * Tries to find a value in the registry.
         * @param {*} value
         * @returns {undefined|*} value if found
         */
        find: function (value) {
            var found;

            if (!Paraclete.Type.is('none', value[this.key])) {
                found = this._super(value[this.key]);
            }

            return found;
        },

        /**
         * Removes value from registry.
         * @param {*} value
         * @returns {undefined|*} value if deleted
         */
        remove: function (value) {
            var removed;

            if (!Paraclete.Type.is('none', value[this.key])) {

                removed = value;
                this._super(value[this.key]);
            }

            return removed;
        }
    });

}(Paraclete));
//! Paraclete.Object
(function (Paraclete) {
    'use strict';
    /*jslint nomen:true*/

    /*global
     Paraclete
     */

    Paraclete.TriggerAble = Paraclete.Class.extend({
        events: new Paraclete.ArrayRegistry(),

        hasTrigger: function (type) {
            return this.events.hasOwnProperty(type);
        },
        on: function (type, callback) {
            return this.events.add(type, callback);
        },
        off: function (eventId) {
            return this.events.remove(eventId);
        },
        trigger: function (type, payload) {
            var events,
                event,
                i;

            events = this.events.find(type);

            if (!Paraclete.Type.is('none', events)) {
                for (i = 0; i < events.length; i += 1) {
                    event = events[i];
                    if (Paraclete.Type.is('function', event.val)) {
                        event.val(payload);
                    }
                }
            }

            return events;
        }
    });

}(Paraclete));
//! Paraclete.Object
(function (Paraclete) {
    'use strict';
    /*jslint nomen:true*/

    /*global
     Paraclete
     */

    var NO_SCOPE_GIVEN = 'NO_SCOPE_GIVEN';

    Paraclete.Validation = Paraclete.TriggerAble.extend({
        rules: {},

        validate: function (obj, scope) {
            var i,
                result,
                hasErrors = false,
                rules = [];

            if (this.rules.hasOwnProperty(scope)) {
                rules = this.rules[scope];
            } else {
                rules = this.rules[NO_SCOPE_GIVEN];
            }

            for (i = 0; i < rules.length; i += 1) {

                result = this.trigger(rules[i](obj));
                hasErrors = !!(hasErrors || result);

            }
            return !hasErrors;
        },

        addRule: function (scope, callback) {
            var fn,
                type;

            if (Paraclete.Type.is('function', scope)) {
                // scope is callback
                fn = scope;
                type = NO_SCOPE_GIVEN;
            } else {
                fn = callback;
                type = scope;
            }

            if (!this.rules.hasOwnProperty(type)) {
                this.rules[type] = [];
            }

            this.rules[type].push(fn);
        }
    });

}(Paraclete));
//! Paraclete.Object
(function (Paraclete) {
    'use strict';
    /*jslint nomen:true*/

    /*global
     Paraclete
     */

    Paraclete.Object = Paraclete.Observable.extend({

        /**
         * increments property by 1 or a given amount
         * @param {String} property
         * @param {Number} incAmount
         * @returns {*} updated value if exists
         */
        inc: function (property, incAmount) {
            var amount = 1,
                oldVal,
                newVal;

            if (Paraclete.Type.is('number', incAmount)) {
                amount = incAmount;
            }

            oldVal = this.get(property);
            if (Paraclete.Type.is('number', oldVal)) {
                newVal = this.set(property, oldVal + amount);
            }

            return newVal;
        },

        /**
         * decrements property by 1 or a given amount
         * @param {String} property
         * @param {Number} incAmount
         * @returns {*} updated value if exists
         */
        dec: function (property, incAmount) {
            var amount = 1,
                oldVal,
                newVal;

            if (Paraclete.Type.is('number', incAmount)) {
                amount = incAmount;
            }

            oldVal = this.get(property);

            if (Paraclete.Type.is('number', oldVal)) {
                newVal = this.set(property, oldVal - amount);
            }

            return newVal;
        },

        /**
         * toggles a property if it has a boolean value
         * @param {String} property
         * @returns {*} property
         */
        toggle: function (property) {
            var prop = this.get(property);
            if (Paraclete.Type.is('boolean', prop)) {
                prop = this.set(property, !prop);
            }
            return prop;
        }
    });

})(Paraclete);
    return Paraclete;
}));