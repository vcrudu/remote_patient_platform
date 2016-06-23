var app=angular.module('app');
    app.controller('patientDevicesCheckoutPayCtrl', ['$scope', '$log', '$state', 'toastr', 'authService', 'BasketService', 'common', '$localStorage',
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


    app.directive('overwriteEmail', function() {
        var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@example\.com$/i;

        return {
            require: '?ngModel',
            link: function(scope, elm, attrs, ctrl) {
                // only apply the validator if ngModel is present and Angular has added the email validator
                if (ctrl && ctrl.$validators.email) {

                    // this will overwrite the default Angular email validator
                    ctrl.$validators.email = function(modelValue) {
                        return ctrl.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
                    };
                }
            }
        };
    });
