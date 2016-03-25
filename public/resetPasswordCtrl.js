/**
 * Created by home on 05/01/2016.
 */

angular.module('app').controller('resetPasswordCtrl',['$scope', '$stateParams','$state', '$http','authService',
    function($scope, $stateParams,$state, $http, authService){
            var link="/resetPassword?token="+$stateParams.token;
           $scope.mmm = $http.get(link)
                .then(function(response) {

                    $scope.content = response.data;
                }, function(response) {

                    $scope.content = "Something went wrong";
                });



        $scope.newUser = {};
        $scope.submitResetPassword = function(){
            if($scope.resetPasswordForm.$valid){
                var dataReset={
                token:$scope.content.token,
                pass:$scope.newUser.password};
                authService.submitResetPassword(dataReset,
                    function(success){
                        if (success){
                            $state.go('login');
                        } else {
                            $state.go('reset');
                        }
                    },function(error){

                        $state.go('reset');
                        //toastr.error(error, 'Error');
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