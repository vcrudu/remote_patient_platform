/**
 * Created by Victor on 2/10/2016.
 */

angular.module("mobileApp")
    .controller("indexCtrl", ['$scope', '$state', function ($scope, $state) {
        $scope.goToState = function(state)
        {
            $state.go(state);
        }

        $scope.goToState("patient-signup");
    }]);
