describe('Paraclete object tests', function() {

    var TestClass = Paraclete.Object.extend({
        param: 100
    });
    var testInstance = new TestClass({
        newParam: 10
    });

    it('checks if instance has class param', function () {
        expect(testInstance.get('param')).toBe(100);
    });

    it('checks if instance has newParam', function () {
        expect(testInstance.get('newParam')).toBe(10);
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

});