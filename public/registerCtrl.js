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

        $scope.stepCountLabel = "Step 1";
        $scope.stepLabel = "Basic Information";

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
                    $state.go($state.$current.data.nextState).then(function() {
                        $scope.fillStepInfo($state.current.name);
                    });
                } else {
                    authService.signup($scope.newUser, successSignIn, errorSignIn);
                }
            }
        };

        $scope.moveBack = function(){
            $state.go($state.$current.data.previousState).then(function() {
                $scope.fillStepInfo($state.current.name);
            });
            $scope.fillStepInfo($state.current.name);
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

        $scope.fillStepInfo = function(state) {
            switch (state) {
                case "register.basic":
                    $scope.stepCountLabel = "Step 1";
                    $scope.stepLabel = "Basic Information";
                    break;
                case "register.address":
                    $scope.stepCountLabel = "Step 2";
                    $scope.stepLabel = "Address and Contact Information";
                    break;
                case "register.medical":
                    $scope.stepCountLabel = "Step 3";
                    $scope.stepLabel = "Medical Information";
                    break;
                case "register.save":
                    $scope.stepCountLabel = "Step 4";
                    $scope.stepLabel = "Finish";
                    break;
                default:
                    $scope.stepCountLabel = "Step 1";
                    $scope.stepLabel = "Finish Information";
                    break;

            }
        };

        $scope.init = function() {
            $scope.fillStepInfo("register.basic");
        };

        $scope.init();
}]);