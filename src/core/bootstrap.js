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