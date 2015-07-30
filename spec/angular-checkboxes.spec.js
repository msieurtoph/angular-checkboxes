'use strict';

describe('mtCheckbox directive', function() {

    beforeEach(module('msieurtoph.ngCheckboxes'));

    var parent, children;
    function compileParent(dom, defaultModel){
        if (!dom) {
            dom = [];
        } else if (!angular.isArray(dom)) {
            dom = [dom];
        }

        children = [];

        for(var i=0, l=dom.length; i<l; i++){
            children.push(angular.element(dom[i]));
        }

        inject(['$rootScope', '$compile', function($rootScope, $compile){
            parent = {
                elt: angular.element('<div data-ng-model="parentModel"></div>'),
                scope: $rootScope.$new()
            };
            parent.scope.parentModel = defaultModel || [];
            children.forEach(function(c){
                parent.elt.append(c);
            });
            parent.compiled = $compile(parent.elt)(parent.scope);
        }]);

        parent.scope.$digest();
    }

    it('should publish `mtCheckboxController.value`', function(){

        compileParent([
            '<input type="checkbox" mt-checkbox />',
            '<input type="checkbox" mt-checkbox="dirAttr" />',
            '<input type="checkbox" mt-checkbox name="nameAttr" />',
            '<input type="checkbox" mt-checkbox="dirAttr" name="nameAttr" />',
            '<input type="checkbox" data-mt-checkbox="dirAttr" />'
        ]);

        expect(children.length).toEqual(5);
        expect(children[0].controller('mtCheckbox').value).toEqual('mtCheckBox_1');
        expect(children[1].controller('mtCheckbox').value).toEqual('dirAttr');
        expect(children[2].controller('mtCheckbox').value).toEqual('nameAttr');
        expect(children[3].controller('mtCheckbox').value).toEqual('dirAttr');
        expect(children[3].controller('mtCheckbox').value).toEqual('dirAttr');

    });

    it('should publish `mtCheckboxController.isChecked`', function(){

        compileParent([
            '<input type="checkbox" mt-checkbox />'
        ]);

        expect(children[0].controller('mtCheckbox').isChecked).toBe(false);

    });

    it('should publish `mtCheckboxController.check()`', function(){

        compileParent([
            '<input type="checkbox" mt-checkbox name="nameAttr1" />',
            '<input type="checkbox" mt-checkbox name="nameAttr2" ng-model="checkboxModel" />',
            '<input type="checkbox" mt-checkbox name="nameAttr3" />'
        ]);

        expect(children[0].prop('checked')).toBe(false);

        children[0].controller('mtCheckbox').check(true);
        expect(children[0].controller('mtCheckbox').isChecked).toBe(true);
        expect(children[0].prop('checked')).toBe(true);
        expect(parent.scope.parentModel).toEqual(['nameAttr1']);

        children[0].controller('mtCheckbox').check(false);
        expect(children[0].controller('mtCheckbox').isChecked).toBe(false);
        expect(children[0].prop('checked')).toBe(false);
        expect(parent.scope.parentModel).toEqual([]);

        expect(parent.scope.checkboxModel).toEqual(false);

        children[1].controller('mtCheckbox').check(true);
        expect(children[1].controller('mtCheckbox').isChecked).toBe(true);
        expect(parent.scope.checkboxModel).toEqual(true);
        expect(parent.scope.parentModel).toEqual(['nameAttr2']);

        children[1].controller('mtCheckbox').check(false);
        expect(children[1].controller('mtCheckbox').isChecked).toBe(false);
        expect(parent.scope.checkboxModel).toEqual(false);
        expect(parent.scope.parentModel).toEqual([]);

        expect(function(){
            children[2].controller('mtCheckbox').check('not boolean value');
        }).toThrow(new TypeError('mtCheckboxController, method check(value): value must be a boolean'));

    });

    it('should watch parentModel and call `mtCheckboxController.check()`', function(){

        compileParent([
            '<input type="checkbox" mt-checkbox name="value1" />',
            '<input type="checkbox" mt-checkbox name="value2" />',
            '<input type="checkbox" mt-checkbox name="value3" />'
        ], ['value1', 'value3']);

        expect(children[0].controller('mtCheckbox').isChecked).toBe(true);
        expect(children[1].controller('mtCheckbox').isChecked).toBe(false);
        expect(children[2].controller('mtCheckbox').isChecked).toBe(true);

        parent.scope.parentModel.shift();
        parent.scope.parentModel.push('value2');
        parent.scope.$apply();

        expect(children[0].controller('mtCheckbox').isChecked).toBe(false);
        expect(children[1].controller('mtCheckbox').isChecked).toBe(true);
        expect(children[2].controller('mtCheckbox').isChecked).toBe(true);

    });

    it ('should catch any checkbox modification and call `mtCheckboxController.check()`', function(){

        compileParent([
            '<input type="checkbox" mt-checkbox name="value1" />',
            '<input type="checkbox" mt-checkbox name="value2" />',
            '<input type="checkbox" mt-checkbox name="value3" ng-model="checkbox3"/>',
            '<input type="checkbox" mt-checkbox name="value4" ng-model="checkbox4"/>'
        ],['value1', 'value3']);

        expect(children[0].controller('mtCheckbox').isChecked).toBe(true);
        expect(children[1].controller('mtCheckbox').isChecked).toBe(false);
        expect(children[2].controller('mtCheckbox').isChecked).toBe(true);
        expect(children[3].controller('mtCheckbox').isChecked).toBe(false);

        // invert all !
        children[0].triggerHandler('change');
        children[1].triggerHandler('change');
        parent.scope.checkbox3 = false;
        parent.scope.checkbox4 = true;
        parent.scope.$apply();

        expect(children[0].controller('mtCheckbox').isChecked).toBe(false);
        expect(children[1].controller('mtCheckbox').isChecked).toBe(true);
        expect(children[2].controller('mtCheckbox').isChecked).toBe(false);
        expect(children[3].controller('mtCheckbox').isChecked).toBe(true);
        expect(parent.scope.parentModel).toEqual(['value2','value4']);

    });



});


/*describe('ex - mtCheckbox directive', function() {

    beforeEach(module('msieurtoph.ngCheckboxes'));

    var parent, directive, directive2,
        parentScope, directiveScope, directive2Scope,
        elt
    ;

    beforeEach(function(){
        parent = angular.element('<div data-ng-model="testModel"></div>');
        directive = angular.element('<input type="checkbox" data-mt-checkbox="dir1" />');
        directive2 = angular.element('<input type="checkbox" mt-checkbox="dir2" ng-model="customLocalModel"/>');
        parent.append(directive).append(directive2);

        inject([
            '$rootScope',
            '$compile',
            function($rootScope, $compile){
                parentScope = $rootScope.$new();
                parentScope.testModel = ['dir2'];
                elt = $compile(parent)(parentScope);
            }
        ]);

        parentScope.$digest();

        directiveScope = directive.isolateScope();
        directive2Scope = directive2.isolateScope();
    });

    it('should get the item value', function(){
        expect(directiveScope.value).toEqual('dir1');
        expect(directive2Scope.value).toEqual('dir2');
    });

    it('should set isChecked boolean from parent model and watch for change', function(){
        //init
        expect(directiveScope.isChecked).toEqual(false);
        expect(directive2Scope.isChecked).toEqual(true);

        // add value to the list :
        parentScope.testModel.push('dir1');
        parentScope.$apply();
        expect(directiveScope.isChecked).toEqual(true);
        expect(directive2Scope.isChecked).toEqual(true);

        // list is not an array;
        parentScope.testModel = 'foobar';
        parentScope.$apply();
        expect(directiveScope.isChecked).toEqual(false);
        expect(directive2Scope.isChecked).toEqual(false);
    });

    it('should set isChecked boolean from checkbox and watch for change', function(){
        //init
        parentScope.testModel = [];
        parentScope.$apply();
        expect(directiveScope.isChecked).toEqual(false);
        expect(directive2Scope.isChecked).toEqual(false);

        directive.triggerHandler('change');
        parentScope.customLocalModel = true;
        parentScope.$apply();
        expect(directiveScope.isChecked).toEqual(true);
        expect(directive2Scope.isChecked).toEqual(true);
        expect(parentScope.testModel.indexOf('dir2')).not.toEqual(-1);

        directive.triggerHandler('change');
        parentScope.customLocalModel = false;
        parentScope.$apply();
        expect(directiveScope.isChecked).toEqual(false);
        expect(directive2Scope.isChecked).toEqual(false);
        expect(parentScope.testModel.indexOf('dir2')).toEqual(-1);

    });

});*/