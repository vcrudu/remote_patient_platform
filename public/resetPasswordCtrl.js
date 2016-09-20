/**
 * Created by home on 05/01/2016.
 */

angular.module('app').controller('resetPasswordCtrl',['$scope', '$stateParams','$state', '$http','authService', 'serverAnswer',
    function($scope, $stateParams,$state, $http, authService,serverAnswer){

        $scope.serverAnswer = serverAnswer;
        $scope.newUser = {};
        $scope.submitResetPassword = function(){
            if($scope.resetPasswordForm.$valid){
                var dataReset={
                token:$scope.serverAnswer.token,
                pass:$scope.newUser.password};
                authService.submitResetPassword(dataReset,
                    function(success){
                        if (success){
                            $state.go('login');
                        } else {
                            $state.go('error');
                        }
                    },function(error){
                        $state.go('error');
                    }
                );
            }
        };
        $scope.$watch("newUser.password", function() {
            $scope.resetPasswordForm.password.$setValidity("matchPassword", $scope.newUser.password == $scope.newUser.passwordConfirm);
            $scope.resetPasswordForm.passwordConfirm.$setValidity("matchPassword", $scope.newUser.password == $scope.newUser.passwordConfirm);
        });

        $scope.$watch("newUser.passwordConfirm", function() {
            $scope.resetPasswordForm.password.$setValidity("matchPassword", $scope.newUser.password == $scope.newUser.passwordConfirm);
            $scope.resetPasswordForm.passwordConfirm.$setValidity("matchPassword", $scope.newUser.password == $scope.newUser.passwordConfirm);
        });
        $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){

            $scope.resetPasswordForm.password.$setDirty();
            $scope.resetPasswordForm.passwordConfirm.$setDirty();

            $scope.resetPasswordForm.password.$setValidity("matchPassword", $scope.newUser.password == $scope.newUser.passwordConfirm);
            $scope.resetPasswordForm.passwordConfirm.$setValidity("matchPassword", $scope.newUser.password == $scope.newUser.passwordConfirm);
            if($scope.resetPasswordForm.$invalid){
                event.preventDefault();
            }
        });
    }]);