/**
 * Created by Victor on 10/05/2015.
 */
angular.module('app').controller('loginCtrl',['$scope', '$state', 'authService', 'toastr','usSpinnerService',
    function($scope, $state, authService, toastr){
    $scope.userCredentials = {};

    $scope.signIn = function(){
        if($scope.loginForm.$valid){
            authService.signin($scope.userCredentials,
                function(success){
                    if(success.success) {
                        $state.go('patient');
                    }else{
                        toastr.warning('Invalid username or password!');
                    }
            },function(error){
                    toastr.error(error, 'Error');
                }
            )
        }
    };
}]);