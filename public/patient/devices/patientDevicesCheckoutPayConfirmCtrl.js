angular.module('app')
    .controller('patientDevicesCheckoutPayConfirmCtrl', ['$scope', '$log', '$state', 'toastr', 'authService', 'BasketService', 'common', '$localStorage',
        function ($scope, $log, $state, toastr, authService, BasketService, common, $localStorage) {

            var vm = this;

            vm.basket = BasketService.getBasket();

            vm.confirmOrder = function(){
                BasketService.confirmOrder()
                    .then(function(result){
                      alert(JSON.stringify(result));
                    },function(e){
                        alert(JSON.stringify(e));
                    })
            }
        }
    ]);
