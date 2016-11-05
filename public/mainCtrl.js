/**
 * Created by Victor on 29/04/2015.
 */

(function() {
    angular.module('app').controller('mainCtrl', ['$scope', '$state', '$localStorage', 'toastr', 'authService', function ($scope, $state, $localStorage, toastr, authService) {
        $scope.extr_page = "extr-page";
        $scope.bodyClass = "desktop-detected pace-done";

        $scope.containerClass = "container";
        $scope.showHtml = true;

        var hash = window.location.hash;

        if (hash != "" &&
            hash.indexOf("login") == -1 &&
            hash.indexOf("register") == -1 &&
            hash.indexOf("confirmSubmit") == -1 &&
            hash.indexOf("reset") == -1 &&
            hash.indexOf("need-activate") == -1 &&
            hash.indexOf("approve-group-invitation") == -1 &&
            hash.indexOf("activate") == -1) {
            setLayout();
        }

        function setLayout() {
            if ($localStorage.user) {
                $scope.extr_page = "";
            }
            else {
                $scope.extr_page = "extr-page";
            }

            $scope.userName = authService.getUserName();
            $scope.containerClass = "";

            setTimeout(function () {
                $scope.$apply(function () {
                    $scope.showHtml = true;
                });

            }, 200);
        }

        $scope.$on('signin', function () {
            setLayout();
        });

        $scope.$on('login', function () {

            $scope.extr_page = "extr-page";
        });

        $scope.logOut = function () {
            $scope.showHtml = false;
            $scope.extr_page = "extr-page";
            $scope.containerClass = "container";

            setTimeout(function () {
                authService.logout(function () {
                    toastr.info('Logged out!', 'Information');
                    $state.go('login');
                });
            }, 100);
        };
    }]);
})();
