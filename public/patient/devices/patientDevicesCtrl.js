/**
 * Created by Victor on 23/06/2015.
 */

angular.module('app').controller('patientDevicesCtrl',['$scope','$log','$state','toastr','authService',
        function($scope, $log, $state, toastr, authService){
                $state.go('patient.devices.buy');

                $state.goTo = function(stateName) {

                    $state.go(stateName);
                };

                $scope.tabIndex = 0;

                $scope.$watch(function(){
                        return $state.$current.name
                }, function(newVal, oldVal){
                        if (newVal === 'patient.devices.buy' || newVal === 'patient.devices.details') {
                                $scope.tabIndex = 0;
                        } else {
                                $scope.tabIndex = 1;
                        }
                });
        }
]);
