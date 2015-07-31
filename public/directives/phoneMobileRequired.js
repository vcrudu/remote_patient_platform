/**
 * Created by Victor on 30/05/2015.
 */

angular.module('app').directive('phoneMobileRequired',function(){
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$validators.phoneMobileRequired = function(modelValue, viewValue) {
                if (scope.formAddress.phone.$viewValue || scope.formAddress.mobile.$viewValue) {
                    return true;
                }
                return false;
            };
        }
    };
});


