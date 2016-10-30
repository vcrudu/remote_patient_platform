/**
 * Created by Victor on 29/04/2015.
 */

(function(){
    angular.module('app').
    controller('mainCtrl', ['$scope','$state','$localStorage','toastr','authService',function($scope, $state, $localStorage, toastr, authService) {
        $scope.extr_page = "extr-page";
        $scope.bodyClass = "desktop-detected pace-done";

        $scope.containerClass = "container";

        var hash = window.location.hash;

        setLayout();


        function setLayout() {

            if ($localStorage.user) {
                $scope.extr_page = "";
            }
            else {
                $scope.extr_page = "extr-page";
            }

            $scope.userName = authService.getUserName();
            $scope.containerClass = "";
        }

/*        if (hash != "" &&
            hash.indexOf("login") == -1 &&
            hash.indexOf("register") == -1 &&
            hash.indexOf("confirmSubmit") == -1 &&
            hash.indexOf("reset") == -1 &&
            hash.indexOf("need-activate") == -1 &&
            hash.indexOf("approve-group-invitation") == -1 &&
            hash.indexOf("activate") == -1) {*/


            $scope.$on('signin', function () {
            setLayout();
        });

        $scope.$on('login', function () {
            debugger;
            $scope.extr_page = "extr-page";
        });

        $scope.logOut = function () {
            authService.logout(function () {
                $scope.containerClass = "container";
                toastr.info('Logged out!', 'Information');
            });

            $scope.extr_page = "extr-page";
            $state.go('login');
        };
    }]);
})();
