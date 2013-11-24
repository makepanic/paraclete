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