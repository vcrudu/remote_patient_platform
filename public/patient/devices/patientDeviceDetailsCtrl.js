/**
 * Created by Victor on 23/06/2015.
 */

angular.module('app').controller('patientDeviceDetailsCtrl', ['$scope', '$log', '$state', 'toastr', '$stateParams', 'deviceService', '$window', 'BasketService',
    function ($scope, $log, $state, toastr, $stateParams, deviceService, $window, BasketService) {

        var vm = this;

        if ($stateParams.model) {
            vm.device = deviceService.get($stateParams.model);
        } else {
            $window.history.back();
        }

        vm.addToBasket = function (checkout) {

            BasketService.addToBasket(vm.device, 1);
            if (!checkout) {
                $window.history.back();
            } else {
                $state.go('patient.devices.checkout');
            }
        }
    }
]);
