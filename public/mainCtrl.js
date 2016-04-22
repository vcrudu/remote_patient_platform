/**
 * Created by Victor on 29/04/2015.
 */

(function(){
    angular.module('app').
    controller('mainCtrl', ['$scope','$state','$localStorage','toastr','authService',function($scope, $state, $localStorage, toastr, authService){
            $scope.extr_page="extr-page";
            $scope.bodyClass="desktop-detected pace-done";

            $scope.containerClass="container";
            function setLayout(){
                if($localStorage.user){
                    $scope.extr_page="";
                    $scope.userName = authService.getUserName();
                    $scope.containerClass="";
                }
            }
            setLayout();
        $scope.$on('signin', function(){
            $scope.extr_page="";
            $scope.userName = authService.getUserName();
            $scope.containerClass="";
        });

        $scope.logOut = function(){
                authService.logout(function(){
                    $scope.containerClass="container";
                    toastr.info('Logged out!','Information');
                });


                $scope.extr_page="extr-page";
                $state.go('login');
            };
    }]);
})();
