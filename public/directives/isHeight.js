/**
 * Created by Victor on 14/06/2015.
 */

angular.module('app').directive('isHeight', function(){
   return {
        require:ngModel,
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$validators = function(modelValue, viewValue){
                var re = /[1-9][0-9]{1,2}]\.?[0-9]{0,2}]/;
            }
        }
   } ;
});