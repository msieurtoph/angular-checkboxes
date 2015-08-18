'use strict';

beforeEach(module('msieurtoph.ngCheckboxes'));

var to, checkboxes, timeout;
function compileParent(dom, defaultValues){
    if (!dom) {
        dom = [];
    } else if (!angular.isArray(dom)) {
        dom = [dom];
    }
    checkboxes = [];
    for(var i=0, l=dom.length; i<l; i++){
        checkboxes.push(angular.element(dom[i]));
    }
    inject(['$rootScope', '$compile', '$timeout', function($rootScope, $compile, $timeout){
        timeout = $timeout;
        to = {
            elt: angular.element('<div data-mt-to="destination"></div>'),
            scope: $rootScope.$new()
        };
        to.scope.destination = defaultValues || [];
        checkboxes.forEach(function(c){
            to.elt.append(c);
        });
        to.compiled = $compile(to.elt)(to.scope);
    }]);
    to.scope.$digest();
}

describe('mtTo directive', function() {

    it('should publish `mtToController.get()`', function(){
        compileParent(null, ['foo', 'bar']);
        expect(to.compiled.controller('mtTo').get()).toEqual(['foo', 'bar']);
    });

    it('should publish `mtToController.set()`', function(){
        compileParent(null, ['foo', 'bar']);
        to.compiled.controller('mtTo').set(['foobar']);
        expect(to.compiled.controller('mtTo').get()).toEqual(['foobar']);
        expect(to.scope.destination).toEqual(['foobar']);
    });

    it('should publish `mtToController.indexOf()`', function(){
        compileParent(null, ['foo', 'bar']);
        expect(to.compiled.controller('mtTo').indexOf('bar')).toEqual(1);
        expect(to.compiled.controller('mtTo').indexOf('baz')).toEqual(-1);
    });

    it('should publish `mtToController.add()`', function(){
        compileParent(null, ['foo', 'bar']);
        expect(to.compiled.controller('mtTo').get()).toEqual(['foo', 'bar']);
        to.compiled.controller('mtTo').add('baz');
        timeout.flush();
        expect(to.compiled.controller('mtTo').get()).toEqual(['foo', 'bar', 'baz']);
        to.compiled.controller('mtTo').add('foo');
        timeout.flush();
        expect(to.compiled.controller('mtTo').get()).toEqual(['foo', 'bar', 'baz']);
        expect(to.scope.destination).toEqual(['foo', 'bar', 'baz']);
    });

    it('should publish `mtToController.remove()`', function(){
        compileParent(null, ['foo', 'bar']);
        expect(to.compiled.controller('mtTo').get()).toEqual(['foo', 'bar']);
        to.compiled.controller('mtTo').remove('baz');
        timeout.flush();
        expect(to.compiled.controller('mtTo').get()).toEqual(['foo', 'bar']);
        to.compiled.controller('mtTo').remove('foo');
        timeout.flush();
        expect(to.compiled.controller('mtTo').get()).toEqual(['bar']);
        expect(to.scope.destination).toEqual(['bar']);
    });

});

describe('mtCheckbox directive', function() {

    it('should publish `mtCheckboxController.value`', function(){
        compileParent([
            '<input type="checkbox" mt-checkbox />',
            '<input type="checkbox" mt-checkbox="\'dirAttr\'" />',
            '<input type="checkbox" mt-checkbox name="nameAttr" />',
            '<input type="checkbox" mt-checkbox="\'dirAttr\'" name="nameAttr" />',
            '<input type="checkbox" data-mt-checkbox="\'dirAttr\'" />'
        ]);

        expect(checkboxes.length).toEqual(5);
        expect(checkboxes[0].controller('mtCheckbox').value).toEqual('mtCheckBox_1');
        expect(checkboxes[1].controller('mtCheckbox').value).toEqual('dirAttr');
        expect(checkboxes[2].controller('mtCheckbox').value).toEqual('nameAttr');
        expect(checkboxes[3].controller('mtCheckbox').value).toEqual('dirAttr');

    });

    it('should parse `mt-checkbox` reference', function(){
        compileParent([
            '<input type="checkbox" mt-checkbox="val1" />',
            '<input type="checkbox" mt-checkbox="val2" />',
            '<input type="checkbox" mt-checkbox="val3" />',
            '<input type="checkbox" mt-checkbox="val4" />',
            '<input type="checkbox" mt-checkbox="val5" />'
        ]);

        to.scope.val1 = 'string';
        to.scope.val2 = {obj:'ect'};
        to.scope.val3 = ['array'];
        to.scope.val4 = 12345;
        to.scope.val5 = true;

        expect(checkboxes.length).toEqual(5);
        expect(checkboxes[0].controller('mtCheckbox').value).toEqual(to.scope.val1);
        expect(checkboxes[1].controller('mtCheckbox').value).toEqual(to.scope.val2);
        expect(checkboxes[2].controller('mtCheckbox').value).toEqual(to.scope.val3);
        expect(checkboxes[3].controller('mtCheckbox').value).toEqual(to.scope.val4);
        expect(checkboxes[4].controller('mtCheckbox').value).toEqual(to.scope.val5);

    });

    it('should publish `mtCheckboxController.state`', function(){
        compileParent([
            '<input type="checkbox" mt-checkbox="\'value1\'" />',
            '<input type="checkbox" mt-checkbox="\'value2\'" />'
        ], ['value2']);

        expect(checkboxes[0].controller('mtCheckbox').state).toBe(false);
        expect(checkboxes[1].controller('mtCheckbox').state).toBe(true);

    });

    it('should publish `mtCheckboxController.set()`', function(){
        compileParent([
            '<input type="checkbox" mt-checkbox="\'value1\'" />',
            '<input type="checkbox" mt-checkbox="\'value2\'" ng-model="checkboxModel" />',
            '<input type="checkbox" mt-checkbox="\'value3\'" />'
        ]);

        expect(checkboxes[0].prop('checked')).toBe(false);

        checkboxes[0].controller('mtCheckbox').set(true);
        timeout.flush();
        expect(checkboxes[0].controller('mtCheckbox').state).toBe(true);
        expect(checkboxes[0].prop('checked')).toBe(true);
        expect(to.scope.destination).toEqual(['value1']);

        checkboxes[0].controller('mtCheckbox').set(false);
        timeout.flush();
        expect(checkboxes[0].controller('mtCheckbox').state).toBe(false);
        expect(checkboxes[0].prop('checked')).toBe(false);
        expect(to.scope.destination).toEqual([]);

        expect(to.scope.checkboxModel).toBe(undefined);

        checkboxes[1].controller('mtCheckbox').set(true);
        timeout.flush();
        expect(checkboxes[1].controller('mtCheckbox').state).toBe(true);
        expect(to.scope.checkboxModel).toEqual(true);
        expect(to.scope.destination).toEqual(['value2']);

        checkboxes[1].controller('mtCheckbox').set(false);
        timeout.flush();
        expect(checkboxes[1].controller('mtCheckbox').state).toBe(false);
        expect(to.scope.checkboxModel).toEqual(false);
        expect(to.scope.destination).toEqual([]);

        checkboxes[2].controller('mtCheckbox').set('not boolean value');
        expect(function(){
            timeout.flush();
        }).toThrow(new Error('No deferred tasks to be flushed'));
        expect(checkboxes[2].controller('mtCheckbox').state).toBe(false);
        expect(checkboxes[2].prop('checked')).toBe(false);
        expect(to.scope.destination).toEqual([]);

    });

    it('should watch destination and call `mtCheckboxController.set()`', function(){

        compileParent([
            '<input type="checkbox" mt-checkbox name="value1" />',
            '<input type="checkbox" mt-checkbox name="value2" />',
            '<input type="checkbox" mt-checkbox name="value3" />'
        ], ['value1', 'value3']);

        expect(checkboxes[0].controller('mtCheckbox').state).toBe(true);
        expect(checkboxes[1].controller('mtCheckbox').state).toBe(false);
        expect(checkboxes[2].controller('mtCheckbox').state).toBe(true);

        to.scope.destination.shift();
        to.scope.destination.push('value2');
        to.scope.$apply();

        expect(checkboxes[0].controller('mtCheckbox').state).toBe(false);
        expect(checkboxes[1].controller('mtCheckbox').state).toBe(true);
        expect(checkboxes[2].controller('mtCheckbox').state).toBe(true);

    });

    it ('should catch any checkbox modification and call `mtCheckboxController.set()`', function(){

        compileParent([
            '<input type="checkbox" mt-checkbox name="value1" />',
            '<input type="checkbox" mt-checkbox name="value2" />',
            '<input type="checkbox" mt-checkbox name="value3" ng-model="checkbox3"/>',
            '<input type="checkbox" mt-checkbox name="value4" ng-model="checkbox4"/>'
        ],['value1', 'value3']);

        expect(checkboxes[0].controller('mtCheckbox').state).toBe(true);
        expect(checkboxes[1].controller('mtCheckbox').state).toBe(false);
        expect(checkboxes[2].controller('mtCheckbox').state).toBe(true);
        expect(checkboxes[3].controller('mtCheckbox').state).toBe(undefined);

        // invert all !
        checkboxes[0].triggerHandler('change');
        checkboxes[1].triggerHandler('change');
        to.scope.checkbox3 = false;
        to.scope.checkbox4 = true;
        to.scope.$apply();
        timeout.flush();

        expect(checkboxes[0].controller('mtCheckbox').state).toBe(false);
        expect(checkboxes[1].controller('mtCheckbox').state).toBe(true);
        expect(checkboxes[2].controller('mtCheckbox').state).toBe(false);
        expect(checkboxes[3].controller('mtCheckbox').state).toBe(true);
        expect(to.scope.destination).toEqual(['value2','value4']);

    });

});
