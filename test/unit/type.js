describe('Paraclete object tests', function() {

    var checkFn = Paraclete.Type.is;

    it('checks for string type', function () {
        expect(checkFn('string', '')).toBe(true);
        expect(checkFn('string', 'wasd')).toBe(true);
        expect(checkFn('string', 'w')).toBe(true);

        expect(checkFn('string', NaN)).toBe(false);
        expect(checkFn('string', null)).toBe(false);
        expect(checkFn('string', undefined)).toBe(false);
        expect(checkFn('string', [])).toBe(false);
        expect(checkFn('string', [])).toBe(false);
        expect(checkFn('string', {})).toBe(false);
        expect(checkFn('string', function () {})).toBe(false);
    });

    it('checks for number type', function () {
        expect(checkFn('number', -1)).toBe(true);
        expect(checkFn('number', Infinity)).toBe(true);
        expect(checkFn('number', 0)).toBe(true);

        expect(checkFn('number', NaN)).toBe(false);
        expect(checkFn('number', null)).toBe(false);
        expect(checkFn('number', undefined)).toBe(false);
        expect(checkFn('number', [])).toBe(false);
        expect(checkFn('number', {})).toBe(false);
        expect(checkFn('number', function () {})).toBe(false);
    });

    it('checks for function type', function () {
        expect(checkFn('function', function () {})).toBe(true);

        expect(checkFn('function', NaN)).toBe(false);
        expect(checkFn('function', null)).toBe(false);
        expect(checkFn('function', undefined)).toBe(false);
        expect(checkFn('function', [])).toBe(false);
        expect(checkFn('function', {})).toBe(false);
    });

    it('checks for object type', function () {
        expect(checkFn('object', {})).toBe(true);

        expect(checkFn('object', NaN)).toBe(false);
        expect(checkFn('object', null)).toBe(false);
        expect(checkFn('object', undefined)).toBe(false);
        expect(checkFn('object', [])).toBe(false);
        expect(checkFn('object', function () {})).toBe(false);
    });

    it('checks for boolean type', function () {
        expect(checkFn('boolean', true)).toBe(true);
        expect(checkFn('boolean', false)).toBe(true);

        expect(checkFn('boolean', NaN)).toBe(false);
        expect(checkFn('boolean', null)).toBe(false);
        expect(checkFn('boolean', undefined)).toBe(false);
        expect(checkFn('boolean', [])).toBe(false);
        expect(checkFn('boolean', function () {})).toBe(false);
    });

});