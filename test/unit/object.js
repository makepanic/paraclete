describe('Paraclete object tests', function() {

    var TestClass = Paraclete.Object.extend({
        param: 100
    });
    var testInstance = new TestClass({
        newParam: 10,
        functionVal: function () {
            return 'inFunction';
        }
    });

    it('checks if instance has class param', function () {
        expect(testInstance.get('param')).toBe(100);
    });

    it('checks if instance has newParam', function () {
        expect(testInstance.get('newParam')).toBe(10);
    });

    it('checks if instance has functionVal and calls its function', function () {
        expect(testInstance.get('functionVal')).toBe('inFunction');
    });

    it('overwrites instance param', function () {
        testInstance.set('param', 200);
        expect(testInstance.get('param')).toBe(200);
        expect(new TestClass().get('param')).toBe(100);
    });

    it('adds a param to instance', function () {
        testInstance.set('newParam', { foo: 'bar' });
        expect(testInstance.get('newParam.foo')).toBe('bar');
    });

    it('tests the Object.inc function', function () {
        var incrementVal;

        testInstance.set('property', 1);
        incrementVal = testInstance.inc('property');
        expect(incrementVal).toBe(2);
        incrementVal = testInstance.inc('property', 3);
        expect(incrementVal).toBe(5);
        expect(testInstance.get('property')).toBe(5);
    });

    it('tests the Object.dec function', function () {
        var decrementVal;

        testInstance.set('property', 1);
        decrementVal = testInstance.dec('property');
        expect(decrementVal).toBe(0);
        decrementVal = testInstance.dec('property');
        expect(decrementVal).toBe(-1);
        decrementVal = testInstance.dec('property', 2);
        expect(decrementVal).toBe(-3);
        expect(testInstance.get('property')).toBe(-3);
    });

    it('tests the Object.toggle function', function () {
        var decrementVal;

        testInstance.set('boolean', false);
        decrementVal = testInstance.toggle('boolean');
        expect(testInstance.get('boolean')).toBe(true);
        decrementVal = testInstance.toggle('boolean');
        expect(testInstance.get('boolean')).toBe(false);
    });

});