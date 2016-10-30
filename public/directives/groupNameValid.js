angular.module('app').directive('groupNameValid',function(){
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl){
            ctrl.$validators.groupNameValid = function(modelValue, viewValue){
                var re = /^[0-9]{10}$/;
                return re.test(modelValue);
            };
        }
    };
});
