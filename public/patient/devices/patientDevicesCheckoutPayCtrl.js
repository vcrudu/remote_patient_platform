angular.module('app')
    .controller('patientDevicesCheckoutPayCtrl', ['$scope', '$log', '$state', 'toastr', 'authService', 'BasketService', 'common', '$localStorage',
        function ($scope, $log, $state, toastr, authService, BasketService, common, $localStorage) {

            var vm = this;

            var user = $localStorage.user;
            if (user) {
                vm.firstname = user.firstname;
                vm.lastname = user.surname;
            }

            vm.shippingAddress = {};

            vm.payment = {
                fundingType: "card"
            };

            common.getCountries()
                .then(function (result) {

                    vm.countries = result.data;

                }, function (e) {
                });

            vm.months = common.getMonths();

            vm.submitForm = function (form) {

                vm.submitted = true;

                if (form && form.$invalid) {
                    return;
                }

                var basket = BasketService.getBasket();
                if (basket) {
                    basket.shippingAddress = vm.shippingAddress;
                    basket.payment = vm.payment;

                    $state.go('patient.devices.checkout-pay-confirm');
                }

            };
        }
    ]);
