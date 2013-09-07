#Paraclete [![Build Status](https://travis-ci.org/makepanic/paraclete.png)](https://travis-ci.org/makepanic/paraclete)

> Paraclete (Gr. παράκλητος, Lat. paracletus) means advocate or helper.
> from [wikipedia: Paraclete](http://en.wikipedia.org/wiki/Paraclete)

##What is it?

It's a JavaScript helper library.

##Features

[`Paraclete.Object`](https://github.com/makepanic/paraclete/wiki/Paraclete.Object)
[`Paraclete.Type`](https://github.com/makepanic/paraclete/wiki/Paraclete.Type)

##Building

This project is build using [grunt](http://gruntjs.com/).

- `npm install` to install all the required dependencies
- `grunt` to build everything

###Grunt targets

- `grunt` default target, which builds a minified file in `build/`
- `grunt dev` same as `grunt` in addition adds a file watcher that rebuilds on changes. Useful in development
- `grunt test` same as `grunt` and runs karma tests on the generated files

##Example

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
