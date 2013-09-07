describe('Paraclete param traversal', function() {

    var testObj = {
        param: 10,
        foo: 'bar',
        deep: {
            param: 10,
            fn: function () {
                return 10 + 20;
            }
        }
    };

    var testGetFn,
        testSetFn;

    testGetFn = function (path) {
        return Paraclete.Traverse.getP(testObj, path);
    };
    testSetFn = function (path, val) {
        return Paraclete.Traverse.setP(testObj, path, val);
    };

    it("get testObj.param", function () {
        expect(testGetFn('param')).toBe(testObj.param);
    });
    it("get testObj.foo", function () {
        expect(testGetFn('foo')).toBe(testObj.foo);
    });
    it("get testObj.deep.param", function () {
        expect(testGetFn('deep.param')).toBe(testObj.deep.param);
    });
    it("get testObj.deep.fn", function () {
        expect(testGetFn('deep.fn')).toBe(testObj.deep.fn());
    });

    it('changes testObj.param to 20', function () {
        testSetFn('param', 20);
        expect(testGetFn('param')).toBe(20);
    });
    it('changes testObj.foo to "lorem"', function () {
        testSetFn('foo', 'lorem');
        expect(testGetFn('foo')).toBe('lorem');
    });
    it('changes testObj.deep.param to 20', function () {
        testSetFn('deep.param', 20);
        expect(testGetFn('deep.param')).toBe(20);
    });

});