#Paraclete [![Build Status](https://travis-ci.org/makepanic/paraclete.png)](https://travis-ci.org/makepanic/paraclete)

> Paraclete (Gr. παράκλητος, Lat. paracletus) means advocate or helper.
> from [wikipedia: Paraclete](http://en.wikipedia.org/wiki/Paraclete)

##What is it?

It's a JavaScript helper library.

##Features

###`Paraclete.Object`

`Paraclete.Object` is based on `Class` by [John Resig](http://ejohn.org/blog/simple-javascript-inheritance/).
All Properties in a `Paraclete.Object` are accessable via `get` and changeable with `set`.
If a property accessed is a function, it is executed and returns the function result instead.

####Methods

Every instance of `Paraclete.Object` has the following methods:

#####set( `path`, `value`)

__returns__ the given value

Sets a value by following the given path.

__Example:__

    // set myObj.foo to 'bar'
    myObj.set('foo', 'bar');

    // set myObj.deep.param to 'value'
    myObj.set('deep.param', 'value');

#####get( `path`)

__returns__ value in `path` or undefined

Returns a value by following the given path.

__Example:__

    // returns 'bar' (myObj.foo)
    myObj.get('foo');

    // returns 'value' (myObj.deep.param)
    myObj.get('deep.param');

#####observe( [`path`,] `callback`)

__returns__ observer id

Adds an observer for changes on the given `path`.
If no `path` is given the `callback` is called once something is set on the object.
The parameter used on the `callback` are:

1. path to parameter relative to observed path
2. value that is going to be set

__Example:__

    myObj.observe('deep', function(param, value){
        console.log('deep changed @', param, 'to', value);
    });

    myObj.observe('deep.param', function(param, value){
        console.log('deep.param changed @', param, 'to', value);
    });

    myObj.observe(function(param, value){
        console.log('myObj changed @', param, 'to', value);
    });

    myObj.set('deep.param', 'newValue');
    // calls observer for '' -> "myObj changed @ deep.param to newValue"
    // calls observer for 'deep' -> "deep changed @ param to newValue"
    // calls observer for 'deep.param' -> "deep.param changed @  to newValue"

#####ignore( [`id`] )

__returns__ true if observer was removed

Removes the observer with a given id.
If no `id` is given, it removes all observer for the object.

####Example

Creates a `User` class that extends Paraclete.Object with `firstName`, `lastName` and `fullName`.

    var User = Paraclete.Object.extend({
        firstName: '',
        lastName: '',
        fullName: function(){
            return this.get('firstName') + ' ' + this.get('lastName')
        }
    });

Creates a instance of the `User` class and overwrites the `firstName` and `lastName` parameters.

    var myUser = new User({
        firstName: 'Foo',
        lastName: 'Bar'
    });

Accesses the `fullName` property of the created user. The `fullName` comes form the `User` class and is a function.
Functions in a `get` are executed and return their result.

    console.log(myUser.get('fullName'));
    // logs: 'Foo Bar'

Sets a new value for `firstName`

    myUser.set('firstName', 'John');
    // returns 'John'


    myUser.get('fullName')
    // returns 'John Bar'

    myUser.set('dad', new User({
        firstName: 'Dad',
        lastName: 'Bar'
        }));

    myUser.get('dad.firstName');
    // returns 'Dad'

    myUser.set('dad.lastName', 'Foo');
    // returns 'Foo'

    myUser.get('dad.fullName');
    // returns 'Dad Foo'

Adds an observer for `dad.lastName` and `dad`

    myUser.observe('dad.lastName', function(fullPath, value){
        console.log('dad.lastName changed, property:', fullPath, value)
    });
    myUser.observe('dad', function(fullPath, value){
        console.log('dad changed, property:', fullPath, value)
    });

    myUser.set('dad.lastName', 'Bar');
    // console.log -> 'dad changed, property: lastName Bar
    // console.log -> 'dad.lastName changed, property:  Bar

##Building

This project is build using [grunt](http://gruntjs.com/).

- `npm install` to install all the required dependencies
- `grunt` to build everything

###Grunt targets

- `grunt` default target, which builds a minified file in `build/`
- `grunt dev` same as `grunt` in addition adds a file watcher that rebuilds on changes. Useful in development
- `grunt test` same as `grunt` and runs karma tests on the generated files