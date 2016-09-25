/**
 * Created by Victor on 12/05/2015.
 */

angular.module('app').controller('registerCtrl',['$scope','$log','$state','toastr','authService','$timeout','$localStorage',
    function($scope, $log, $state, toastr, authService, $timeout, $localStorage){
        $scope.newUser ={type:"patient"};
        $scope.states = [];
        $scope.successMessage = "Done";
        $scope.successSubMessage = "Click submit to finish registration";
        $scope.isProviderMenuItemActive = false;
        $scope.isPatientMenuItemActive = true;

        $scope.$on('onPendingCheckUserExists', function(name, pendingState){
            $scope.pendingState = pendingState;

        });

        $scope.forward= function() {
            if ($state.$current.data.order == 4) {
                return "Submit";
            } else {
                return "Next";
            }
        };
        $scope.moveNext = function(){
            if(!$scope.pendingState) {
                if ($state.$current.data.nextState) {
                    $state.go($state.$current.data.nextState);
                } else {
                    authService.signup($scope.newUser, successSignIn, errorSignIn);
                }
            }
        };

        $scope.moveBack = function(){
            $state.go($state.$current.data.previousState);
        };

        $scope.previousDisabled = function(){
            return !$state.$current.data.previousState;
        };

        $scope.nextButtonClass = function(){
            return "next";
        };

        var successSignIn = function(response){
            toastr.success('Successful Registration!','Please confirm the subscription from your email box!');
            $timeout(function() {
                toastr.clear();
                var localUser = $localStorage.user;
                if (localUser)
                {
                    $state.go('need-activate', {userName: localUser.email});
                }
                else
                {
                    $state.go('need-activate');
                }
            }, 3000);
            //$state.go('patient');
        };

        var errorSignIn = function(err){
            toastr.error(err,'Error');
        };
}]);