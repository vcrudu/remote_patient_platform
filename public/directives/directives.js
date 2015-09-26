angular.module('app')
    .directive('basketAmount', function ($rootScope, BasketService) {
        return {
            restrict: 'AE',
            template: '<span class="badge bg-color-green" ng-if="basket.getAmount() >0 ">{{basket.getAmount() | number :2}}&pound</span>',
            replace: true,
            link: function (scope, elm, attrs) {

                $rootScope.$on('basketChanged', function () {
                    scope.basket = BasketService.getBasket();
                });

            }
        };
    })
    .directive('smartMaskedInput', function () {
        return {
            restrict: 'A',
            compile: function (tElement, tAttributes) {
                tElement.removeAttr('smart-masked-input data-smart-masked-input');

                var options = {};
                if (tAttributes.maskPlaceholder) options.placeholder = tAttributes.maskPlaceholder;
                tElement.mask(tAttributes.smartMaskedInput, options);
            }
        };
    })
    .directive('scheduleTime',function(){
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl){
                ctrl.$validators.scheduleTime = function(modelValue, viewValue){
                   // if(!modelValue)
                   return true;
                   // var re = /((([0-1][0-9])|([2][0-3])):([0-5][0-9]))(\s)*[-](\s)*((([0-1][0-9])|([2][0-3])):([0-5][0-9]))/g;
                   // return re.test(modelValue);
                };
            }
        };
    }).directive('formatIntervals',function(){
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl){

                function toModel(value) {
                    var re = /(((([0-1][0-9])|([2][0-3])):([0-5][0-9]))(\s)*[-](\s)*((([0-1][0-9])|([2][0-3])):([0-5][0-9])))/g;
                    var results = re.exec(value);

                    var valueToReturn = '';

                    while(results){
                        var result = results[0];
                        result = result.replace(/\s/g, '');
                        valueToReturn = valueToReturn + result + ','
                        results = re.exec(value);
                    }

                    if(valueToReturn.length>0){
                        valueToReturn= valueToReturn.slice(0,valueToReturn.length-1);
                    }

                    scope.scheduleForm.schedule.$viewValue = valueToReturn;
                    scope.scheduleForm.schedule.$render();
                    return valueToReturn === '' ? 'NA' : valueToReturn;
                }

                ctrl.$parsers.push(toModel);
            }
        };
    }).directive('scheduleTimeRequired',function(){
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl){
                return scope.$apply(attrs.scheduleTimeRequired);
            }
        };
    });
