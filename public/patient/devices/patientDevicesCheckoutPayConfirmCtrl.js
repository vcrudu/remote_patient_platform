angular.module('app')
    .controller('patientDevicesCheckoutPayConfirmCtrl', ['$scope', '$log', '$state', 'toastr', 'authService', 'BasketService', 'Messaging',
        function ($scope, $log, $state, toastr, authService, BasketService, Messaging) {

            var vm = this;

            vm.basket = BasketService.getBasket();

            vm.confirmOrder = function(){

                vm.loading = true;
                BasketService.confirmOrder()
                    .then(function(result){
                        vm.loading = false;
                        if(result && result.data){
                            if(!result.data.success){
                                Messaging.errHandle(result.data);
                            }else{
                                BasketService.clearBasket();
                                $state.go('patient.devices');
                            }

                        }
                    },function(e){
                        vm.loading = false;
                        Messaging.errHandle(e);
                    })
            }
        }
    ]);
