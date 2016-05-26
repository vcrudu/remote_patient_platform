/**
 * Created by Victor on 5/26/2016.
 */

(function() {
    angular.module('app').controller('providerAlarmListCtrl', ["$scope", "$http", "_", "appSettings", "$localStorage", "$state", "alarmBuilderFactoryService",
        function ($scope, $http, _, appSettings, $localStorage, $state, alarmBuilderFactoryService) {
            $scope.alarmTemplates = [];
            $scope.availableTemplates = [];

            $scope.handleAlarmTemplateSelected = function(template) {
                $state.go("provider.alarm_builder_edit", {alarmName: template.alarmName});
            };

            $scope.init = function() {
                $http.get("/provider/alarms/availableTemplates.json").success(function(data) {
                    $scope.availableTemplates = data;

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

                            _.each($scope.alarmTemplates, function(alarmTemplate) {
                                alarmTemplate.rulesText = [];
                                if (alarmTemplate.rules) {
                                    _.each(alarmTemplate.rules, function(rule) {
                                        var template = _.find($scope.availableTemplates, function (availableTemplate) { return availableTemplate.name === rule.ruleTemplate});

                                        if (template != null) {
                                            var text = "<b><u>" + (rule.prefix ? "where" : "where not") + "</u></b> " + template.phrase;
                                            
                                            var args = rule.arguments;

                                            switch (template.name) {
                                                case "BloodPressureSystolicBetween":
                                                case "BloodPressureDiastolicBetween":
                                                case "HeartRateBetween":
                                                case "BloodOxygenBetween":
                                                case "TemperatureBetween":
                                                    text = text.replace("<u><b>min value</b></u>", "<u><b>"+ args[1].textValue +"</b></u>");
                                                    text = text.replace("<u><b>max value</b></u>", "<u><b>"+ args[2].textValue +"</b></u>");
                                                    break;
                                                case "BloodPressureSystolic":
                                                case "BloodPressureDiastolic":
                                                case "HeartRate":
                                                case "BloodOxygen":
                                                case "Temperature":
                                                    var operator = _.find(alarmBuilderFactoryService.operatorValues, function (operatorValue) {
                                                        var result = operatorValue.id === args[1].textValue;
                                                        return result;
                                                    });
                                                    text = text.replace("<u><b>operator</b></u>", "<u><b>"+ operator.value +"</b></u>");
                                                    text = text.replace("<u><b>value</b></u>", "<u><b>"+ args[2].textValue +"</b></u>");
                                                    break;
                                            }
                                            
                                            alarmTemplate.rulesText.push(text);
                                        }
                                    });
                                }
                            });

                        } else {
                        }
                    }).error(function (err) {

                    });
                });
            };

            $scope.init();
        }
    ]);
})();