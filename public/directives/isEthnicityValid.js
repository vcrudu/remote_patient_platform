/**
 * Created by Victor on 12/9/2015.
 */

angular.module('app').directive('isEthnicityValid',function(){
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl){
      ctrl.$validators.isEthnicityValid = function(modelValue, viewValue){
        switch (modelValue)
        {
          case "British/Mixed British":
          case "Irish":
          case "Other White Background":
          case "White & BlackCaribbean":
          case "White & Black African":
          case "Other Mixed Background":
          case "Indian/ British Indian":
          case "Pakistani/British Pakistani":
          case "Bangladeshi/British Bangladeshi":
          case "Other Asian Background":
          case "Caribbean":
          case "Chinese":
          case "Other Black Background":
          case "Other ethnic group":
            return true;
          default:
            return false;
        }
      };
    }
  };
});