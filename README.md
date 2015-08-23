# angular-checkboxes
Bind a list of checkboxes to a unique ng-model array.

[![npm version](https://badge.fury.io/js/angular-checkboxes.svg)](http://badge.fury.io/js/angular-checkboxes)
[![Build Status](http://img.shields.io/travis/msieurtoph/angular-checkboxes.svg)](https://travis-ci.org/msieurtoph/angular-checkboxes) [![Code Climate](https://codeclimate.com/github/msieurtoph/angular-checkboxes/badges/gpa.svg)](https://codeclimate.com/github/msieurtoph/angular-checkboxes) [![Test Coverage](https://codeclimate.com/github/msieurtoph/angular-checkboxes/badges/coverage.svg)](https://codeclimate.com/github/msieurtoph/angular-checkboxes)

[![dependency Status](http://img.shields.io/david/msieurtoph/angular-checkboxes.svg?style=flat)](https://david-dm.org/msieurtoph/angular-checkboxes#info=dependencies) [![devDependency Status](http://img.shields.io/david/dev/msieurtoph/angular-checkboxes.svg?style=flat)](https://david-dm.org/msieurtoph/angular-checkboxes#info=devDependencies)

## What is it?

If you are used to manipulate HTML forms, you probably know that each checkbox is a separate variable (or maybe an ngModel with AngularJS).

Sometimes, it could be usefull to manipulate all these checkboxes as a unique array.

`angular.checkboxes` module lets you turn your list of checkboxes into a unique destination array, providing :
* **two-way binding**: manipulate the destination array will check/uncheck the checkboxes AND check/uncheck the checkboxes will modify the destination array.
* **no isolated scope for each checkbox**: the directive does not create new child scope.
* **a mtCheckboxController**: internal controller can be injected to other directives.

## Demos & usage

http://msieurtoph.github.io/angular-checkboxes

## Installation

`npm i angular-checkboxes --save`

## Simple Example

Please, visit http://msieurtoph.github.io/angular-checkboxes for live examples.

```html
<form>
    ...
    <div mt-to="myUniqueArray">
        <input type="checkbox" mt-checkbox name="value1" /> Value 1 <br/>
        <input type="checkbox" mt-checkbox name="value2" /> Value 2 <br/>
        <input type="checkbox" mt-checkbox name="value3" /> Value 3 <br/>
    </div>
    ...
</form>

```

Let's check *Value 1* and *Value 2*, and you will get (in the current scope):

```javascript
myUniqueArray= [
    "value1",
    "value2"
];
```

Let's push `value3` to `myUniqueArray` now, and you will check the *Value 3* checkbox.

Pretty cool, no ?

**/!\ Do not forget to $apply() the scope changes when manipulating destination array!**

## What if the checkbox also has an ngModel

Don't care about that, the module takes it in charge. Just use them if you need, they will be updated with the flow: if you add or remove a value from the destination array, the checkbox ngModel (a boolean) will be switched.

The only thing to know is : during the initialisation phase, if the ngModel state of the checkbox differs from its state in the destination array, the ngModel will be overriden. So if the checkbox is checked, but the value is not in the array : the checkbox will be unchecked... 

A possible enhancement could be to add an option (in the Provider or as an attribute) to force it to work the other way and give the checkbox ngModel the priority on the array.

## mtCheckboxController

The directive `mtCheckbox` provides a `controller`. It publishes :

* `value` (string)

  The value that will be pushed to/shifted from the destination array for this checkbox. See [the demo page](http://msieurtoph.github.io/angular-checkboxes/) to know how to initialize it.

* `state` (boolean)

  It tells if the checkbox is currently checked or not.
  It is better not to change this `state` manually and prefer the `set(state)` method.

* `set(state)` (function(boolean))

  It allows external directives to check (`value=true`) or uncheck (`value=false`) the checkbox programmatically. Any other non-boolean `value` will do nothing.


## mtToController

The directive `mtTo` provides a `controller` too. It publishes :

* `get()` (function())

  The _getter_ for the destination array.

* `set(list)` (function(array))

  The _setter_ for the destination array. The provided array will replace the existing one.

* `indexOf(elt)` (function(elt))

  To get the index of the provided element in the destination array.

* `add(elt)` (function(elt))

  To push an element to the destination array, except if the element is already added.

* `remove(elt)` (function(elt))

  To remove an element from the destination array, if present.

