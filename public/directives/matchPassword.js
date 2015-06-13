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

angular.module('app').directive('passwordFormat',function(){
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$validators.passwordFormat = function(modelValue, viewValue) {

                var oneNumber = /[0-9]/;
                var oneLowerCase = /[a-z]/;
                var oneUpperCase = /[A-Z]/;

                if (modelValue && modelValue.length>=6 &&
                    oneNumber.test(modelValue) &&
                    oneLowerCase.test(modelValue) &&
                    oneUpperCase.test(modelValue)
                    ) {
                    return true;
                }
                return false;
            };
        }
    };
});

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
