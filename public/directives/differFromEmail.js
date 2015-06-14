/**
 * Created by Victor on 14/06/2015.
 */

angular.module('app').directive('differFromEmail',function(){
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$validators.differFromEmail = function(modelValue, viewValue) {

                if (scope.formBasic.email.$viewValue &&
                    scope.formBasic.email.$viewValue!=modelValue
                ) {
                    return true;
                }
                return false;
            };
        }
    };
});
