/**
 * Created by Victor on 12/05/2015.
 */

angular.module('app').controller('registerCtrl',['$scope','$log','$state','toastr','authService','$timeout','$localStorage',
    function($scope, $log, $state, toastr, authService, $timeout, $localStorage){
        $scope.newUser ={type:"patient"};
        $scope.states = [];
        $scope.successMessage = "Done";
        $scope.successSubMessage = "Click next to finish registration";

        $scope.moveNext = function(){
            if($state.$current.data.nextState){
                $state.go($state.$current.data.nextState);
            }else{
                authService.signup($scope.newUser, successSignIn, errorSignIn);
            }
        };

        $scope.moveBack = function(){
            $state.go($state.$current.data.previousState);
        };

        $scope.previousButtonClass = function(){
            return $state.$current.data.previousState?"previous":"previous disabled";
        };

        $scope.nextButtonClass = function(){
            return "next";
        };

        var successSignIn = function(response){
            toastr.success('redirecting to sign in...','Successful Registration!');
            $timeout(function() {
                toastr.clear();
                var localUser = $localStorage.user;
                if (localUser)
                {
                    $state.go('login.username', {userName: localUser.email});
                }
                else
                {
                    $state.go('login');
                }
            }, 3000);
            //$state.go('patient');
        };

        var errorSignIn = function(err){
            toastr.error(err,'Error');
        };
}]);