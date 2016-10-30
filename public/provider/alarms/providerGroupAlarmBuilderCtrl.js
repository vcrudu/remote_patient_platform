/**
 * Created by Victor on 5/6/2016.
 */
(function() {
    angular.module('app').controller('providerGroupAlarmBuilderCtrl', ["$scope", "$http", "$modal", "$stateParams","alarmBuilderFactoryService", "appSettings", "$localStorage", "$state", "_", "toastr",
        function ($scope, $http, $modal, $stateParams, alarmBuilderFactoryService, appSettings, $localStorage, $state, _, toastr) {

        $scope.groupName = $stateParams.groupName;

         var   byGroupName = $stateParams.groupName;
        //   alert("GROUP NAME IS ====    "+$state.params.groupName);

       //     alert("ALARM NAME IS=====    "+$state.params.alarmName);


            $scope.alarmTemplateModel = {
                alarmName: "",
                alarmDescription: "",
                alarmNameDisabled: false,
                conditionsInvalid: false
            };

            $scope.formWasSubmitted = false;

            $scope.submitForm = function(isValid) {
                $scope.formWasSubmitted = true;

                if (!isValid) {
                    return;
                }

                var alarmTemplateToPost = {
                    alarmName: $scope.alarmTemplateModel.alarmName,
                    alarmDescription: $scope.alarmTemplateModel.alarmDescription,
                    rules: []
                };

                if (!$scope.conditions || $scope.conditions.length == 0) {
                    $scope.alarmTemplateModel.conditionsInvalid = true;
                    return;
                }

                if ($scope.conditions && $scope.conditions.length > 0) {
                    for(var i=0;i<$scope.conditions.length;i++) {
                        if (!alarmBuilderFactoryService.isValidCondition($scope.conditions[i])) {
                            $scope.alarmTemplateModel.conditionsInvalid = true;
                            return;
                        }

                        alarmTemplateToPost.rules.push(alarmBuilderFactoryService.translateCondition($scope.conditions[i]));
                    }
                }

                $scope.alarmTemplateModel.conditionsInvalid = false;

                var req = {
                    method: 'POST',
                    url: appSettings.getServerUrl() + '/v1/api/groupalarm',
                    headers: {
                        'x-access-token': $localStorage.user.token
                    },
                    data: {alarmTemplate: alarmTemplateToPost,
                           groupname: $stateParams.groupName}
                };

                $http(req).success(function (res) {
                    if (res.success) {
                        $scope.alarmTemplateModel.alarmNameDisabled = true;
                        toastr.success('Group Alarm Template saved!','Success');
                        $state.go("provider.patients_groups_members.groupalarmrules");
                    } else {
                    }
                }).error(function (err) {

                });
            }

            $scope.availableTemplates = [];
            $scope.conditions = [];

            $scope.resolveModalDependencies = function(conditionObj, label, minValue) {
                return {
                    condition: function() {
                        return conditionObj;
                    },
                    label: function() {
                        return label;
                    },
                    pattern: function () {
                        return alarmBuilderFactoryService.getValidationRegex(conditionObj.name);
                    },
                    value: function() {
                        return alarmBuilderFactoryService.getConditionValue(conditionObj, minValue);
                    }
                };
            };

            $scope.changePrefix = function(scope) {
                var conditionObj = scope.condition;
                conditionObj.prefix = scope.condition.prefix ? false : true;

                var element = $("#" + conditionObj.id);
                if (element && element.length > 0) {
                    var booleanPrefixElement = element.find(".BooleanPrefix");
                    if (booleanPrefixElement && booleanPrefixElement.length > 0) {
                        if (conditionObj.prefix) {
                            booleanPrefixElement.text(alarmBuilderFactoryService.booleanConditions[0].value);
                            booleanPrefixElement.attr("data-prefix-value", alarmBuilderFactoryService.booleanConditions[0].id);
                        }
                        else {
                            booleanPrefixElement.text(alarmBuilderFactoryService.booleanConditions[1].value);
                            booleanPrefixElement.attr("data-prefix-value", alarmBuilderFactoryService.booleanConditions[1].id);
                        }
                    }
                }
            };

            $scope.remove = function(scope) {
                var conditionObj = scope.condition;
                var element = $("#" + conditionObj.id);
                if (element && element.parent()) {
                    element.parent().remove();

                    for (var i =0; i < $scope.conditions.length; i++)
                        if ($scope.conditions[i].id === conditionObj.id) {
                            $scope.conditions.splice(i,1);
                            break;
                        }
                }
            }

            $scope.setValue = function(scope, minValue, label, valueContainerClass) {
                var conditionObj = scope.condition;
                var modal = $modal.open({
                    animation: true,
                    templateUrl: "valueModal.html",
                    controller: "setValueModalCtrl",
                    size: "sm",
                    resolve: $scope.resolveModalDependencies(conditionObj, label, minValue)
                });

                modal.result.then(function (data) {
                    var value = data;
                    var element = $("#" + conditionObj.id);
                    if (element && element.length > 0) {
                        var minValueSpan = element.find("." + valueContainerClass);
                        if (minValueSpan && minValueSpan.length > 0) {
                            minValueSpan.attr("data-value", value)
                            minValueSpan.text(value);
                            alarmBuilderFactoryService.setConditionValue(conditionObj, minValue, value);
                        }
                    }
                }, function (arg) {
                });
            };

            $scope.setOperator = function(scope) {
                var conditionObj = scope.condition;
                var modal = $modal.open({
                    animation: true,
                    templateUrl: "operatorModal.html",
                    controller: "setOperatorModalCtrl",
                    size: "sm",
                    resolve: {
                        operators: function() {
                            return alarmBuilderFactoryService.getOperatorsByConditionName(conditionObj.name);
                        },
                        selectedOperator: function () {
                            return conditionObj.operator.id;
                        }
                    }
                });

                modal.result.then(function (data) {
                    var operators = alarmBuilderFactoryService.getOperatorsByConditionName(conditionObj.name);

                    var operator = undefined;
                    for(var i=0;i<operators.length;i++) {
                        if (operators[i].id === data) {
                            operator = operators[i];
                        }
                    }

                    var element = $("#" + conditionObj.id);
                    if (element && element.length > 0) {
                        var minValueSpan = element.find(".Operator");
                        if (minValueSpan && minValueSpan.length > 0) {
                            minValueSpan.attr("data-value", operator.id)
                            minValueSpan.text(operator.value);

                            conditionObj.operator = operator;
                        }
                    }
                }, function (arg) {
                });
            };

            $scope.moveToConditions = function(template) {
                var parsedCondition = template.template.replace("$BooleanPrefix$", "<span data-param=\"$BooleanPrefix$\" class=\"BooleanPrefix\" ng-click=\"changePrefix(this)\">" + alarmBuilderFactoryService.booleanConditions[0].value + "</span>");

                switch (template.type){
                    case "BetweenCondition":
                        parsedCondition = parsedCondition.replace("$MinValue$", "<span data-param=\"$MinValue$\" class=\"MinValue\" ng-click=\"setValue(this, true, 'Min Value', 'MinValue')\">min value</span>");
                        parsedCondition = parsedCondition.replace("$MaxValue$", "<span data-param=\"$MaxValue$\" class=\"MaxValue\" ng-click=\"setValue(this, false, 'Max Value', 'MaxValue')\">max value</span>");
                        break;
                    case "Condition":
                        parsedCondition = parsedCondition.replace("$Operator$", "<span data-param=\"$Operator$\" class=\"Operator\" ng-click=\"setOperator(this)\">operator</span>");
                        parsedCondition = parsedCondition.replace("$Value$", "<span data-param=\"$Value$\" class=\"Value\" ng-click=\"setValue(this, true, 'Value', 'Value')\">value</span>");
                        break;
                }

                $scope.conditions.push({
                    id: alarmBuilderFactoryService.guid(),
                    name: template.name,
                    parsedCondition: parsedCondition,
                    prefix: true,
                    value1: undefined,
                    value2: undefined,
                    operator: undefined,
                });
            };

            $scope.init = function() {
                $http.get("/provider/alarms/availableTemplates.json").success(function(data) {
                    $scope.availableTemplates = data;


        //            alert("$state.params   == "+$state.params);
          //          alert("$state.params.alarmName   == "+$state.params.alarmName);

                    if ($state && $state.params && $state.params.alarmName)
                    
             //           alert("AM AJUNS LA PARAMETRUL ALARMNAME SI GROUPNAME!!!!!!")
          //          alert("ALARM NAME DIN  ESTE ===== "+$state.params.alarmName);
          //          alert("GROUP NAME ESTE    == "+$stateParams.groupName);
                    {
                        var req = {
                            method: 'GET',
                            url: appSettings.getServerUrl() + '/v1/api/groupalarms/' + $stateParams.groupName,
                            headers: {
                                'x-access-token': $localStorage.user.token
                            }
                        };
                        
                        $http(req).success(function (res) {
                            if (res.success) {
                               

                                var foundAlarm = _.find(res.items, function (globalAlarm) { return globalAlarm.alarmName.toLowerCase() === $state.params.alarmName.toLowerCase() });

                          //     console.log("FOUNDALARM == "+foundAlarm.alarmName);
                         //      console.log("ALARMDESCRIPTION ===  "+ foundAlarm.alarmDescription);

                                if (foundAlarm) {
                                    $scope.alarmTemplateModel.alarmName = foundAlarm.alarmName;
                                    $scope.alarmTemplateModel.alarmDescription = foundAlarm.alarmDescription;
                                    $scope.alarmTemplateModel.alarmNameDisabled = true;

                                    _.each(foundAlarm.rules, function(rule) {
                                        var template = _.find($scope.availableTemplates, function (availableTemplate) { return availableTemplate.name === rule.ruleTemplate });
                                        if (template) {

                                            var condition = {
                                                id: alarmBuilderFactoryService.guid(),
                                                prefix: rule.prefix,
                                                name: template.name
                                            };

                                            var booleanCondition = rule.prefix ? alarmBuilderFactoryService.booleanConditions[0].value : alarmBuilderFactoryService.booleanConditions[1].value;
                                            var parsedCondition = template.template.replace("$BooleanPrefix$", "<span data-param=\"" + booleanCondition + "\" class=\"BooleanPrefix\" ng-click=\"changePrefix(this)\">" + booleanCondition + "</span>");

                                            switch (template.type){
                                                case "BetweenCondition":
                                                    condition.operator = undefined;
                                                    condition.value1 = alarmBuilderFactoryService.getConditionValueBasedOnTemplate(rule.arguments[1].textValue, template);
                                                    condition.value2 = alarmBuilderFactoryService.getConditionValueBasedOnTemplate(rule.arguments[2].textValue, template);
                                                    parsedCondition = parsedCondition.replace("$MinValue$", "<span data-param=\"" + rule.arguments[1].textValue + "\" class=\"MinValue\" ng-click=\"setValue(this, true, 'Min Value', 'MinValue')\">" + rule.arguments[1].textValue + "</span>");
                                                    parsedCondition = parsedCondition.replace("$MaxValue$", "<span data-param=\"" + rule.arguments[2].textValue + "\" class=\"MaxValue\" ng-click=\"setValue(this, false, 'Max Value', 'MaxValue')\">" + rule.arguments[2].textValue + "</span>");
                                                    break;
                                                case "Condition":
                                                    var operator = alarmBuilderFactoryService.getOperatorById(rule.arguments[1].textValue);
                                                    condition.operator = operator;
                                                    condition.value1 = alarmBuilderFactoryService.getConditionValueBasedOnTemplate(rule.arguments[2].textValue, template);

                                                  //  var value = condition.value1.replace("'", "");
                                                    //    value = value.replace("'", "");

                                                        var value = condition.value1;

                                                    condition.value2 = undefined;
                                                    parsedCondition = parsedCondition.replace("$Operator$", "<span data-param=\"" + operator.value + "\" class=\"Operator\" ng-click=\"setOperator(this)\">" + operator.value + "</span>");
                                                    parsedCondition = parsedCondition.replace("$Value$", "<span data-param=\"" + rule.arguments[2].textValue + "\" class=\"Value\" ng-click=\"setValue(this, true, 'Value', 'Value')\">" + value + "</span>");
                                                    break;
                                            }

                                            condition.parsedCondition = parsedCondition;
                                            $scope.conditions.push(condition);
                                        }
                                    });
                                }
                            } else {
                            }
                        }).error(function (err) {

                        });                    }
                });
            };

            $scope.init();
        }
    ]);

    angular.module('app').controller('setValueModalCtrl', ["$scope", "$modalInstance", "condition", "label", "pattern", "value",
        function ($scope, $modalInstance, condition, label, pattern, value) {
            $scope.label = label;
            $scope.model = {
                value: value ? value.toString() : ""
            };

            $scope.cssClass = "form-control";

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };

            $scope.ok = function() {
                var validationResult = pattern.test($scope.model.value);
                if (validationResult) {
                    $modalInstance.close($scope.model.value);
                }
                else {
                    $scope.cssClass = "form-control invalid-value";
                }
            };
        }
    ]);

    angular.module('app').controller('setOperatorModalCtrl', ["$scope", "$modalInstance", "operators", "selectedOperator", "_",
        function ($scope, $modalInstance, operators, selectedOperator, _) {
            $scope.operators = operators;
            $scope.selectedOperator = selectedOperator ? selectedOperator : operators[0];

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };

            $scope.ok = function() {
                var select = $("#selectedOperator");
                if (select) {
                    $modalInstance.close($scope.selectedOperator);
                    return;
                }

                $modalInstance.close(undefined);
            };
        }
    ]);
})();