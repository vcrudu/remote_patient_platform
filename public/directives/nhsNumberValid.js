/**
 * Created by Victor on 14/06/2015.
 */

angular.module('app').directive('nhsNumberValid',function(){
   return {
       require: 'ngModel',
       link: function(scope, elm, attrs, ctrl){
               ctrl.$validators.nhsNumberValid = function(modelValue, viewValue){
                    var re = /^[0-9]{10}$/;
                   return re.test(modelValue);
               };
       }
   };
});
