/**
 * Created by Victor on 23/06/2015.
 */

angular.module('app').controller('patientMainCtrl',['$scope','$log','$state','toastr','authService',
        function($scope, $log, $state, toastr, authService){
            $scope.bodyClass="desktop-detected pace-done";

        }
]);
