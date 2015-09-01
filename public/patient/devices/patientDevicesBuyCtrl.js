/**
 * Created by Victor on 23/06/2015.
 */

angular.module('app').controller('patientDevicesBuyCtrl', ['$scope', '$log', '$state', 'toastr', 'authService', 'deviceService',
    function ($scope, $log, $state, toastr, authService, deviceService) {

        var vm = this;

        vm.searchDevices = function () {

            deviceService.search()
                .then(function (result) {


                    if(result && result.items){
                        vm.devices = result.items;
                    }

                }, function (error) {

                });
        };

        vm.showDetails = function(device){
            $state.go('patient.devices.details',{model:device.model});

        };

        vm.searchDevices();
    }
]);
