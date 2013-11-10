describe('Paraclete object tests', function() {

    var checkFn = Paraclete.Type.is,
        findFn = Paraclete.Type.find,
        fn = function(){};

    it('checks Type.find for string type', function () {
        expect(findFn('')).toBe('string');
        expect(findFn('w')).toBe('string');
        expect(findFn('wasd')).toBe('string');

        expect(findFn(NaN)).not.toBe('string');
        expect(findFn(null)).not.toBe('string');
        expect(findFn(undefined)).not.toBe('string');
        expect(findFn([])).not.toBe('string');
        expect(findFn({})).not.toBe('string');
        expect(findFn(fn)).not.toBe('string');
        expect(findFn(1)).not.toBe('string');
        expect(findFn(true)).not.toBe('string');
        expect(findFn(false)).not.toBe('string');
    });

    it('checks Type.find for number type', function () {
        expect(findFn(1)).toBe('number');
        expect(findFn(0)).toBe('number');
        expect(findFn(-1)).toBe('number');

        expect(findFn(NaN)).not.toBe('number');
        expect(findFn(null)).not.toBe('number');
        expect(findFn(undefined)).not.toBe('number');
        expect(findFn([])).not.toBe('number');
        expect(findFn({})).not.toBe('number');
        expect(findFn(fn)).not.toBe('number');
        expect(findFn('1')).not.toBe('number');
        expect(findFn(true)).not.toBe('number');
        expect(findFn(false)).not.toBe('number');
    });

    it('checks Type.find for function type', function () {
        expect(findFn(fn)).toBe('function');

        expect(findFn(NaN)).not.toBe('function');
        expect(findFn(null)).not.toBe('function');
        expect(findFn(undefined)).not.toBe('function');
        expect(findFn([])).not.toBe('function');
        expect(findFn({})).not.toBe('function');
        expect(findFn('1')).not.toBe('function');
        expect(findFn(1)).not.toBe('function');
        expect(findFn(true)).not.toBe('function');
        expect(findFn(false)).not.toBe('function');
    });

    it('checks Type.find for object type', function () {
        expect(findFn({})).toBe('object');

        expect(findFn(NaN)).not.toBe('object');
        expect(findFn(null)).not.toBe('object');
        expect(findFn(undefined)).not.toBe('object');
        expect(findFn([])).not.toBe('object');
        expect(findFn('1')).not.toBe('object');
        expect(findFn(1)).not.toBe('object');
        expect(findFn(fn)).not.toBe('object');
        expect(findFn(true)).not.toBe('object');
        expect(findFn(false)).not.toBe('object');
    });

    it('checks Type.find for boolean type', function () {
        expect(findFn(true)).toBe('boolean');
        expect(findFn(false)).toBe('boolean');

        expect(findFn(NaN)).not.toBe('boolean');
        expect(findFn(null)).not.toBe('boolean');
        expect(findFn(undefined)).not.toBe('boolean');
        expect(findFn([])).not.toBe('boolean');
        expect(findFn('1')).not.toBe('boolean');
        expect(findFn(1)).not.toBe('boolean');
        expect(findFn(fn)).not.toBe('boolean');
        expect(findFn({})).not.toBe('boolean');
    });


    it('checks Type.is for string type', function () {
        expect(checkFn('string', '')).toBe(true);
        expect(checkFn('string', 'wasd')).toBe(true);
        expect(checkFn('string', 'w')).toBe(true);

        expect(checkFn('string', NaN)).toBe(false);
        expect(checkFn('string', null)).toBe(false);
        expect(checkFn('string', undefined)).toBe(false);
        expect(checkFn('string', [])).toBe(false);
        expect(checkFn('string', {})).toBe(false);
        expect(checkFn('string', fn)).toBe(false);
    });

    it('checks Type.is for number type', function () {
        expect(checkFn('number', -1)).toBe(true);
        expect(checkFn('number', Infinity)).toBe(true);
        expect(checkFn('number', 0)).toBe(true);

        expect(checkFn('number', NaN)).toBe(false);
        expect(checkFn('number', null)).toBe(false);
        expect(checkFn('number', undefined)).toBe(false);
        expect(checkFn('number', [])).toBe(false);
        expect(checkFn('number', {})).toBe(false);
        expect(checkFn('number', fn)).toBe(false);
    });

    it('checks Type.is for function type', function () {
        expect(checkFn('function', function () {})).toBe(true);

        expect(checkFn('function', NaN)).toBe(false);
        expect(checkFn('function', null)).toBe(false);
        expect(checkFn('function', undefined)).toBe(false);
        expect(checkFn('function', [])).toBe(false);
        expect(checkFn('function', {})).toBe(false);
    });

    it('checks Type.is for object type', function () {
        expect(checkFn('object', {})).toBe(true);

        expect(checkFn('object', NaN)).toBe(false);
        expect(checkFn('object', null)).toBe(false);
        expect(checkFn('object', undefined)).toBe(false);
        expect(checkFn('object', [])).toBe(false);
        expect(checkFn('object', fn)).toBe(false);
    });

    it('checks Type.is for boolean type', function () {
        expect(checkFn('boolean', true)).toBe(true);
        expect(checkFn('boolean', false)).toBe(true);

        expect(checkFn('boolean', NaN)).toBe(false);
        expect(checkFn('boolean', null)).toBe(false);
        expect(checkFn('boolean', undefined)).toBe(false);
        expect(checkFn('boolean', [])).toBe(false);
        expect(checkFn('boolean', fn)).toBe(false);
    });

});