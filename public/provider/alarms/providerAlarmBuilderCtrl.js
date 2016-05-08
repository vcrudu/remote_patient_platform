/**
 * Created by Victor on 5/6/2016.
 */
(function() {
    angular.module('app').controller('providerAlarmBuilderCtrl', ["$scope", "$http", "$modal",
        function ($scope, $http, $modal) {
            $scope.booleanConditions = [{id: "Where", value: "where"}, {id: "WhereNot", value: "where not"}];
            $scope.operatorValues = [
                {id: "Equal", value: "equal"},
                {id: "NotEqual", value: "not equal"},
                {id: "GreaterThan", value: "greater than"},
                {id: "GreaterThanOrEqual", value: "greater than or equal to"},
                {id: "LessThan", value: "less than"},
                {id: "LessThanOrEqual", value: "less than or equal to"},
            ];

            $scope.availableTemplates = [];
            $scope.conditions = [];

            $scope.getValidationRegex = function(conditionName) {
                switch (conditionName) {
                    case "BloodPressureSystolicBetween":
                    case "BloodPressureSystolic":
                    case "BloodPressureDiastolicBetween":
                    case "BloodPressureDiastolic":
                    case "HeartRateBetween":
                    case "HeartRate":
                    case "BloodOxygenBetween":
                    case "BloodOxygen":
                        return /^[0-9]*$/;
                    case "TemperatureBetween":
                    case "Temperature":
                        return /^[+-]?\d+(\.\d+)?$/;
                    default:
                        return /.*$/;

                }
            };

            $scope.getConditionValue = function(conditionObj, minValue) {
                switch (conditionObj.name) {
                    case "BloodPressureSystolicBetween":
                    case "BloodPressureSystolic":
                    case "BloodPressureDiastolicBetween":
                    case "BloodPressureDiastolic":
                    case "HeartRateBetween":
                    case "HeartRate":
                    case "BloodOxygenBetween":
                    case "BloodOxygen":
                        if (minValue) {
                            return parseInt(conditionObj.value1);
                        }
                        else {
                            return parseInt(conditionObj.value2);
                        }
                    case "TemperatureBetween":
                    case "Temperature":
                        if (minValue) {
                            return parseFloat(conditionObj.value1);
                        }
                        else {
                            return parseInt(conditionObj.value2);
                        }
                    default:
                        return undefined;

                }
            };

            $scope.resolveModalDependencies = function(conditionObj, label, minValue) {
                return {
                    condition: function() {
                        return conditionObj;
                    },
                    label: function() {
                        return label;
                    },
                    pattern: function () {
                        return $scope.getValidationRegex(conditionObj.name);
                    },
                    value: function() {
                        return $scope.getConditionValue(conditionObj, minValue);
                    }
                };
            };

            $scope.guid = function() {
                function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000)
                        .toString(16)
                        .substring(1);
                }
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                    s4() + '-' + s4() + s4() + s4();
            };

            $scope.changePrefix = function(scope) {
                var conditionObj = scope.condition;
                conditionObj.prefix = scope.condition.prefix ? false : true;

                var element = $("#" + conditionObj.id);
                if (element && element.length > 0) {
                    var booleanPrefixElement = element.find(".BooleanPrefix");
                    if (booleanPrefixElement && booleanPrefixElement.length > 0) {
                        if (conditionObj.prefix) {
                            booleanPrefixElement.text($scope.booleanConditions[0].value);
                            booleanPrefixElement.attr("data-prefix-value", $scope.booleanConditions[0].id);
                        }
                        else {
                            booleanPrefixElement.text($scope.booleanConditions[1].value);
                            booleanPrefixElement.attr("data-prefix-value", $scope.booleanConditions[1].id);
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
                            if (minValue) {
                                conditionObj.value1 = parseFloat(value);
                            }
                            else {
                                conditionObj.value2 = parseFloat(value);
                            }
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
                            return $scope.operatorValues;
                        },
                        selectedOperator: function () {
                            return conditionObj.operator;
                        }
                    }
                });

                modal.result.then(function (data) {
                    var element = $("#" + conditionObj.id);
                    if (element && element.length > 0) {
                        var minValueSpan = element.find(".Operator");
                        if (minValueSpan && minValueSpan.length > 0) {
                            minValueSpan.attr("data-value", data.id)
                            minValueSpan.text(data.value);

                            conditionObj.operator = data;
                        }
                    }
                }, function (arg) {
                });
            };

            $scope.moveToConditions = function(template) {
                var parsedCondition = template.template.replace("$BooleanPrefix$", "<span data-param=\"$BooleanPrefix$\" class=\"BooleanPrefix\" ng-click=\"changePrefix(this)\">" + $scope.booleanConditions[0].value + "</span>");

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
                    id: $scope.guid(),
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

    angular.module('app').controller('setOperatorModalCtrl', ["$scope", "$modalInstance", "operators", "selectedOperator",
        function ($scope, $modalInstance, operators, selectedOperator) {
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