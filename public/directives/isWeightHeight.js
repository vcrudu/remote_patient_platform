/**
 * Created by Victor on 14/06/2015.
 */

angular.module('app').directive('isWeightHeight', function(){
   return {
        require:'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$validators.isWeightHeight = function(modelValue, viewValue){
                var re = /^[1-9][0-9]{0,2}(\.[0-9]+)?$/;
                if(re.test(modelValue)) {
                    return modelValue>10;
                }
                else return false;
        };
   }};
});