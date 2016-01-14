/**
 * Created by home on 04/01/2016.
 */
angular.module('app').controller('resetCtrl',['$scope', '$state', 'authService',
    function($scope, $state, authService){

        $scope.submitReset = function(){
            if($scope.resetForm.$valid){
                authService.submitReset($scope.userCredentials.email,
                    function(success){

                                $state.go('confirmSubmit');



                    },function(error){

                            toastr.error(error, 'Error');

                    }
                );
            }
        };
    }]);
