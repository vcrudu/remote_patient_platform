/**
 * Created by Victor on 2/4/2016.
 */

angular.module("mobileApp")
    .controller("ProviderCtrl",
        ['$scope', '$state', function($scope, $state) {
            $scope.gotoState = function(state)
            {
                $state.go(state);
            }

            $scope.gotoState('appointments');
        }]);