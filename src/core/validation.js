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