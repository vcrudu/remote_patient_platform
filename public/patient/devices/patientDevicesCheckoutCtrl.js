/**
 * Created by Victor on 23/06/2015.
 */

angular.module('app').controller('patientDevicesCheckoutCtrl', ['$scope', '$log', '$state', 'toastr', 'authService', 'BasketService',
    function ($scope, $log, $state, toastr, authService, BasketService) {

        var vm = this;

        vm.basket = BasketService.getBasket();

        vm.removeItem = function(item){
            BasketService.removeItem(item);
        }
    }
]);
