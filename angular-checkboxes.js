'use strict';

angular.module('msieurtoph.ngCheckboxes', [])

.directive('mtCheckbox', [function () {
    return {
        restrict: 'A',
        require: ['^^ngModel', '?ngModel'],
        scope: {
            value: '@mtCheckbox'
        },

        link: function(scope, element, attrs, ctrls){

            scope.arrayCtrl = ctrls[0];
            scope.checkboxCtrl = ctrls[1];

            scope.$watch('isChecked', function(newV){
                if (undefined === newV) {
                    return;
                }
                if (scope.checkboxCtrl) {
                    scope.checkboxCtrl.$setViewValue(scope.isChecked);
                } else {
                    element.prop('checked', scope.isChecked);
                }

                var index = scope.arrayCtrl.$modelValue.indexOf(scope.value);
                if (newV && index === -1){
                    scope.arrayCtrl.$modelValue.push(scope.value);
                } else if (!newV && index !== -1) {
                    scope.arrayCtrl.$modelValue.splice(index, 1);
                }
            });

            scope.$watchCollection('arrayCtrl.$modelValue', function(newV){
                scope.isChecked = angular.isArray(newV) && newV.indexOf(scope.value) !== -1;
            });

            if (scope.checkboxCtrl){
                scope.checkboxCtrl.$validators.setIsChecked = function(value){
                    scope.isChecked = value;
                    return true;
                };
            } else {
                element.on('change', function(){
                    scope.isChecked = !scope.isChecked;
                });
            }

        }
    };
}]);