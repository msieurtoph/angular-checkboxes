'use strict';

describe('mtCheckbox directive', function() {

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

});