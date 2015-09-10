/**
 * Created by Victor on 12/05/2015.
 */

angular.module('app').controller('registerCtrl',['$scope','$log','$state','toastr','authService',
    function($scope, $log, $state, toastr, authService){
        $scope.newUser ={type:"patient"};
        $scope.states = [];

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
            $state.go('patient');
        };

        var errorSignIn = function(err){
            toastr.error(err,'Error');
        };
}]);