/**
 * Created by Victor on 2/8/2016.
 */

angular.module("mobileApp")
    .controller("PatientCtrl",
        ['$scope', '$state', function($scope, $state) {
            $scope.gotoState = function(state)
            {
                $state.go(state);
            }

            $scope.gotoState('vitalsigns');
        }]);
