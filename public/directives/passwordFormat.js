/**
 * Created by Victor on 14/06/2015.
 */

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
