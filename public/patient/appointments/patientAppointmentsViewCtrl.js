/**
 * Created by Victor on 23/06/2015.
 */

angular.module('app').controller('patientAppointmentsViewCtrl',['$scope','$log','$state','toastr','authService',
    'ngDialog', 'callService',
        function($scope, $log, $state, toastr, authService, ngDialog, callService) {
                $scope.makeCall = function () {
                        callService.getMeetingRoom(function (res) {

                        });
                };
        }
]);
