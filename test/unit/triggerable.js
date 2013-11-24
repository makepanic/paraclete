describe('Paraclete TriggerAble tests', function() {

    it('checks on, off, trigger', function () {

        var triggerable = new Paraclete.TriggerAble(),
            trigger1 = false,
            trigger2 = false,
            trigger3 = false,
            triggerId1,
            triggerId2,
            triggerId3,
            triggerId4;

        triggerId1 = triggerable.on('trigger-key', function () {
            trigger1 = true;
        });
        triggerId2 = triggerable.on('trigger-key', function () {
            trigger2 = true;
        });
        triggerId3 = triggerable.on('other-trigger-key', function () {
            trigger3 = true;
        });
        triggerId4 = triggerable.on('trigger-key-undo', function () {
            trigger1 = false;
        });

        triggerable.off(triggerId4);
        triggerable.trigger('trigger-key');
        triggerable.trigger('trigger-key-undo');

        runs(function () {
            expect(trigger1).toBe(true);
            expect(trigger2).toBe(true);
            expect(trigger3).toBe(false);
        });
    });

});