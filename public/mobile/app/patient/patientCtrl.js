/**
 * Created by Victor on 2/8/2016.
 */

angular.module("mobileApp")
    .controller("PatientCtrl",
        ['$scope', '$state', 'messagesBusService', function($scope, $state, messagesBusService) {
            window.messageBus = messagesBusService;

            $scope.gotoState = function(state)
            {
                $state.go(state);
            }

            $scope.gotoState('vitalsigns');

            var subscriber1 = {
                name: 'event-subscriber-1',
                handler: function (data) {
                    $scope.result = data;
                }
            };

            window.messageBus.register('sample-event', subscriber1);

            $scope.$on("$destroy", function() {
                window.messageBus.unregister('sample-event', 'event-subscriber-1');
        });
        }]);
