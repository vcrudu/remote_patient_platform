/**
 * Created by Victor on 5/26/2016.
 */

(function() {
    angular.module('app').controller('providerAlarmListCtrl', ["$scope", "$http", "_", "appSettings", "$localStorage", "$state",
        function ($scope, $http, _, appSettings, $localStorage, $state) {
            $scope.alarmTemplates = [];

            $scope.handleAlarmTemplateSelected = function(template) {
                $state.go("provider.alarm_builder_edit", {alarmName: template.alarmName});
            };

            $scope.init = function() {
                var req = {
                    method: 'GET',
                    url: appSettings.getServerUrl() + '/v1/api/globalalarms',
                    headers: {
                        'x-access-token': $localStorage.user.token
                    }
                };

                $http(req).success(function (res) {
                    if (res.success) {
                        _.each(res.items, function(item) {
                            $scope.alarmTemplates.push(item);
                        });
                    } else {
                    }
                }).error(function (err) {

                });
            };

            $scope.init();
        }
    ]);
})();