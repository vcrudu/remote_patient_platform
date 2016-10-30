(function() {
    angular.module('app').controller("providerGroupAlarmList", ["$rootScope", "$scope", "$http", "_", "appSettings", "$stateParams", "$localStorage", "$state", "alarmBuilderFactoryService", "toastr",
        function ($rootScope, $scope, $http, _, appSettings, $stateParams, $localStorage, $state, alarmBuilderFactoryService, toastr) {

            $scope.alarmTemplates = [];
            $scope.availableTemplates = [];

            $scope.$on("addAlarmTemplateClickEvent", function() {
                $state.go("provider.patients_groups_members.alarmbuilder");
            });

            $scope.handleAlarmTemplateSelected = function(template) {
                $state.go("provider.patients_groups_members.alarmbuilder_edit", {alarmName: template.alarmName, groupName: $stateParams.groupName });
            };

            $scope.deleteAlarmTemplate = function(template) {
                var req = {
                    method: 'DELETE',
                    url: appSettings.getServerUrl() + '/v1/api//groupalarm?alarmName=' + template.alarmName+"&groupname="+$stateParams.groupName,
                    headers: {
                        'x-access-token': $localStorage.user.token
                    }
                };

                $http(req).success(function (res) {
                    if (res.success) {
                        toastr.success('Group Alarm Template deleted!','Success');

                        var index = -1;
                        for(var i=0; i<$scope.alarmTemplates.length;i++) {
                            if (template.alarmName == $scope.alarmTemplates[i].alarmName) {
                                index = i;
                                break;
                            }
                        }

                        if (index > -1) {
                            //   alert(index);
                            $scope.alarmTemplates.splice(index, 1);
                        }
                    } else {
                        toastr.success('Error happen!','Error');
                    }
                }).error(function (err) {
                    toastr.success('Error happen!','Error');
                });
            };

            $scope.init = function() {
                $http.get("/provider/alarms/availableTemplates.json").success(function(data) {
                    $scope.availableTemplates = data;

                    var req = {
                        method: 'GET',
                        url: appSettings.getServerUrl() + '/v1/api/groupalarms/' + $stateParams.groupName,
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
                                                case "AgeBetween":
                                                case "WeightBetween":
                                                    text = text.replace("<u><b>min value</b></u>", "<u><b>"+ args[1].textValue +"</b></u>");
                                                    text = text.replace("<u><b>max value</b></u>", "<u><b>"+ args[2].textValue +"</b></u>");
                                                    break;
                                                case "BloodPressureSystolic":
                                                case "BloodPressureDiastolic":
                                                case "HeartRate":
                                                case "BloodOxygen":
                                                case "Temperature":
                                                case "Age":
                                                case "Sex":
                                                case "Weight":
                                                    var operator = _.find(alarmBuilderFactoryService.operatorValues, function (operatorValue) {
                                                        var result = operatorValue.id === args[1].textValue;
                                                        return result;
                                                    });

                                                    var textValue = args[2].textValue.replace("'", "");
                                                    textValue = textValue.replace("'", "");

                                                    text = text.replace("<u><b>operator</b></u>", "<u><b>"+ operator.value +"</b></u>");
                                                    text = text.replace("<u><b>value</b></u>", "<u><b>"+ textValue +"</b></u>");
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
                        // console.log("EROARE !!!  ");

                    });
                });
            };

            $scope.init();
        }
    ]);
})();