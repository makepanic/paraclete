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