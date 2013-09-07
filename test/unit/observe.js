describe('Paraclete object tests', function() {

    var TestClass = Paraclete.Object.extend({
        param: 100,
        deep: {
            param: 10,
            object: new Paraclete.Object({
                inObject: 1
            })
        }
    });

    var testInstance = new TestClass();


    it("adds an observer for param", function () {
        var paramObserverCalled = false;

        testInstance.observe('param', function(fullPath, value){
            paramObserverCalled = true;
        });

        runs(function() {
            testInstance.set('param', 200);
        });

        waitsFor(function() {
            return paramObserverCalled;
        }, "observer was called", 1000);
    });

    it("adds an observer for deep.param, deep.object.inObject", function () {
        var deepObserverCalled = 0;
        var deepParamObserverCalled = 0;
        var deepParamObjectObserverCalled = 0;
        var testInstanceObserverCalled = 0;
        var arrayObserverCalled = 0;

        testInstance.observe(function(){
            testInstanceObserverCalled++;
        });

        testInstance.observe('deep', function(){
            deepObserverCalled++;
        });

        testInstance.observe('deep.param', function(fullPath, value){
            deepParamObserverCalled++;
        });

        testInstance.observe('deep.object.inObject', function(fullPath, value){
            deepParamObjectObserverCalled++;
        });

        testInstance.observe(['deep.param', 'deep.object.inObject'], function(){
            arrayObserverCalled++;
        });

        runs(function() {
            testInstance.set('deep.param', 20);
            testInstance.set('deep.object.inObject', 2);
        });

        waitsFor(function() {
            return  deepObserverCalled === 2 &&
                    deepParamObserverCalled === 1 &&
                    deepParamObjectObserverCalled === 1 &&
                    testInstanceObserverCalled === 2 &&
                    arrayObserverCalled === 2;
        }, "observer was called", 1000);
    });

    it("adds an observer for deep.param and removes it", function () {
        var deepParamObserverCalled = 0,
            arrayDeepParamObserverCalled = 0,
            observerIds,
            observerId;

        testInstance.ignore();

        observerId = testInstance.observe('deep.param', function(){
            deepParamObserverCalled++;
        });

        observerIds = testInstance.observe(['deep.param'], function(){
            arrayDeepParamObserverCalled++;
        });

        runs(function() {
            testInstance.set('deep.param', 20);
            testInstance.ignore(observerId);
            testInstance.ignore(observerIds)
            testInstance.set('deep.param', 20);
        });

        waitsFor(function() {
            return  deepParamObserverCalled === 1 &&
                arrayDeepParamObserverCalled === 1;
        }, "observer was called", 1000);
    });

});