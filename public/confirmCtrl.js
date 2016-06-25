/**
 * Created by home on 04/01/2016.
 */
angular.module('app').controller('confirmCtrl',['$scope', '$state', '$stateParams','authService','toastr',
    function($scope, $state, $stateParams, authService, toastr){
        $scope.email="";

        if ($state && $state.params && $state.params.userName)
        {
            $scope.email = $stateParams.userName;
        }
        $scope.hideSendAgain=true;
        $scope.setShowForm = function(){
            $scope.hideSendAgain=false;
        };

        $scope.submitSendConfirm = function(){

                if($scope.confirmForm.$valid){
                    authService.submitConfirm($scope.email,
                        function(success){

                            $state.go('login');



                        },function(error){

                            toastr.error(error, 'Error');

                        }
                    );
                }

        };
    }]);
