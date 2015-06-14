/**
 * Created by Victor on 30/05/2015.
 */

angular.module('app').directive('matchPassword',function(){
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$validators.matchPassword = function(modelValue, viewValue) {
                if (scope.formBasic.password.$viewValue&&scope.formBasic.passwordConfirm.$viewValue&&
                    scope.formBasic.password.$viewValue==scope.formBasic.passwordConfirm.$viewValue) {
                    scope.formBasic.password.$setValidity('matchPassword',true);
                    scope.formBasic.passwordConfirm.$setValidity('matchPassword',true);
                    return true;
                }
                return false;
            };
        }
    };
});


