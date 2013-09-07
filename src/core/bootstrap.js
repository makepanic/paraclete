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