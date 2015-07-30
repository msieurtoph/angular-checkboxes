'use strict';

angular.module('msieurtoph.ngCheckboxes', [])

.directive('mtCheckbox', [function () {

    var internalCount = 0;
    function uniqName(){
        return 'mtCheckBox_' + (++internalCount);
    }

    return {
        restrict: 'A',
        require: ['mtCheckbox', '^^ngModel', '?ngModel'],

        controller: ['$attrs', function($attrs){

            this.value = '' === $attrs.mtCheckbox ?
                (!!$attrs.name && '' !== $attrs.name ?
                    $attrs.name
                    : uniqName()
                )
                : $attrs.mtCheckbox
            ;

            this.isChecked = false;

        }],

        link: function(scope, element, attrs, ctrls){

            var ctrl = ctrls[0],
                parentCtrl = ctrls[1],
                hasNgModel = !!ctrls[2],
                ngModelCtrl = ctrls[2]
            ;

            // add method to the controller to check/uncheck the checkbox!
            // init isChecked value, set local state/model and report to parent Model
            ctrl.check = function(value){

                if ('boolean' !== typeof value ){
                    throw new TypeError('mtCheckboxController, method check(value): value must be a boolean');
                }

                ctrl.isChecked = value;

                if (hasNgModel) {
                    ngModelCtrl.$setViewValue(ctrl.isChecked);
                } else {
                    element.prop('checked', ctrl.isChecked);
                }

                var index = parentCtrl.$modelValue.indexOf(ctrl.value);
                if (ctrl.isChecked && index === -1){
                    parentCtrl.$modelValue.push(ctrl.value);
                } else if (!ctrl.isChecked && index !== -1) {
                    parentCtrl.$modelValue.splice(index, 1);
                }
            };

            // watch change in the parent Model (= the array)
            // and then call check() ...
            scope.$watchCollection(function(){
                return parentCtrl.$modelValue;
            }, function(newV){
                ctrl.check(angular.isArray(newV) && newV.indexOf(ctrl.value) !== -1);
            });

            // watch ngModel change if supplied, or DOM interaction if not.
            // and then call check() ...
            if (hasNgModel){

                // init ngModel if not
                if ('boolean' !== typeof ngModelCtrl.$modelValue){
                    ctrl.check(ctrl.isChecked);
                }
                // and add validator to update isChecked
                ngModelCtrl.$validators.setIsChecked = function(value){
                    ctrl.check(value);
                    return true;
                };

            } else {

                element.prop('checked', ctrl.isChecked);
                element.on('change', function(){
                    ctrl.check(!ctrl.isChecked);
                });

            }


        }
    };
}]);