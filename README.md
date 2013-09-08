#Paraclete [![Build Status](https://travis-ci.org/makepanic/paraclete.png)](https://travis-ci.org/makepanic/paraclete)

> Paraclete (Gr. παράκλητος, Lat. paracletus) means advocate or helper.
> from [wikipedia: Paraclete](http://en.wikipedia.org/wiki/Paraclete)

##What is it?

It's a JavaScript helper library.

##Features

- [`Paraclete.Object`](https://github.com/makepanic/paraclete/wiki/Paraclete.Object) - powerful `Object`
- [`Paraclete.Type`](https://github.com/makepanic/paraclete/wiki/Paraclete.Type) - variable type checking

##Building

This project is build using [grunt](http://gruntjs.com/).

- `npm install` to install all the required dependencies
- `grunt` to build everything

###Grunt targets

- `grunt` default target, which builds a minified file in `build/`
- `grunt dev` same as `grunt` in addition adds a file watcher that rebuilds on changes. Useful in development
- `grunt test` same as `grunt` and runs karma tests on the generated files
