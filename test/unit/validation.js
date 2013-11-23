describe('Paraclete newValidation tests', function() {

    it('checks newValidation', function () {

        var validation = new Paraclete.Validation(),
            hasRuleTrueError = false,
            validationTrue = false;

        validation.addRule('some-rule', function (val) {
            if (val === 'do-invalidate') {
                return 'validation-trigger';
            }
        });

        validation.on('validation-trigger', function () {
            hasRuleTrueError = true;
        });

        validation.validate('do-invalidate', 'some-rule');

        waitsFor(function () {
            return hasRuleTrueError;
        }, 'validation rule called', 200);

        runs(function () {
            expect(hasRuleTrueError).toBe(true);
            expect(validationTrue).toBe(false);
        });
    });

});