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
;
