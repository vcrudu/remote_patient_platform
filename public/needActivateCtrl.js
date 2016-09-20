/**
 * Created by home on 04/01/2016.
 */
angular.module('app').controller('needActivateCtrl',['$scope', '$state', '$stateParams','authService','toastr',
    function($scope, $state, $stateParams, authService, toastr) {
        $scope.email = "";

        $scope.showSendAgain = false;
        $scope.setShowForm = function () {
            $scope.showSendAgain = true;
        };

        $scope.submitSendConfirm = function () {

            if ($scope.confirmForm.$valid) {
                authService.submitConfirm($scope.email,
                    function (res) {
                        if (res.data.success) {
                            toastr.info(res.data.message, 'Info', {timeOut: 10000});
                            $state.go('check-email-box');
                        } else {
                            $state.go('error');
                        }
                    }, function (error) {
                        $state.go('error');
                        toastr.error(error, 'Error');
                    }
                );
            }

        };
    }]);
