/**
 * Created by Victor on 21/07/2015.
 */


angular.module('app').directive('isPhone',function(){
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl){
            ctrl.$validators.isPhone = function(modelValue, viewValue){
                if(!modelValue) return true;
                var re = /^(((\+((44)|(351))\s?|0044\s?)?|(\(?0))((2[03489]\)?\s?\d{4}\s?\d{4})|(1[23456789]1\)?\s?\d{3}\s?\d{4})|(1[23456789][234578][0234679]\)?\s?\d{6})|(1[2579][0245][0467]\)?\s?\d{5})|(11[345678]\)?\s?\d{3}\s?\d{4})|(1[35679][234689]\s?[46789][234567]\)?\s?\d{4,5})|([389]\d{2}\s?\d{3}\s?\d{4})|([57][0-9]\s?\d{4}\s?\d{4})|(500\s?\d{6})|(7[456789]\d{2}\s?\d{6})))$/;
                return re.test(modelValue);
            };
        }
    };
});
