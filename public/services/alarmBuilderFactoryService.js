/**
 * Created by Victor on 5/26/2016.
 */

angular.module('app').factory('alarmBuilderFactoryService',
    ["_", function (_) {

        var self = this;
        
        self.operatorValues = [
            {id: "Equal", value: "equals"},
            {id: "NotEqual", value: "not equals"},
            {id: "GreaterThan", value: "greater than"},
            {id: "GreaterThanOrEqual", value: "greater than or equal to"},
            {id: "LessThan", value: "less than"},
            {id: "LessThanOrEqual", value: "less than or equal to"},
        ];

        self.booleanConditions = [{id: "Where", value: "where"}, {id: "WhereNot", value: "where not"}];

        self.guid = function() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        };

        self.getOperatorsByConditionName = function(conditionName) {
            switch (conditionName) {
                case "Sex":
                    var array = [];
                    array.push(self.operatorValues[0]);
                    return array;
                default:
                    return self.operatorValues;
            }
        };
        
        self.setConditionValue = function(conditionObj, minValue, value) {
            switch (conditionObj.name) {
                case "Sex":
                    if (minValue) {
                        conditionObj.value1 = new String("'" + value + "'");
                    }
                    else {
                        conditionObj.value2 = new String("'" + value + "'");
                    }
                    break;
                default:
                    if (minValue) {
                        conditionObj.value1 = parseFloat(value);
                    }
                    else {
                        conditionObj.value2 = parseFloat(value);
                    }
                    break;
            }
        };

        self.getValidationRegex = function(conditionName) {
            switch (conditionName) {
                case "BloodPressureSystolicBetween":
                case "BloodPressureSystolic":
                case "BloodPressureDiastolicBetween":
                case "BloodPressureDiastolic":
                case "HeartRateBetween":
                case "HeartRate":
                case "BloodOxygenBetween":
                case "BloodOxygen":
                case "AgeBetween":
                case "Age":
                    return /^[0-9]*$/;
                case "TemperatureBetween":
                case "Temperature":
                case "WeightBetween":
                case "Weight":
                    return /^[+-]?\d+(\.\d+)?$/;
                case "Sex":
                    return /^((?:fe)?male)$/;
                default:
                    return /.*$/;

            }
        };

        self.getOperatorById = function(operatorId) {
            return _.find(self.operatorValues, function (operator) { return operator.id === operatorId });
        };

        self.getConditionValue = function(conditionObj, minValue) {
            switch (conditionObj.name) {
                case "BloodPressureSystolicBetween":
                case "BloodPressureSystolic":
                case "BloodPressureDiastolicBetween":
                case "BloodPressureDiastolic":
                case "HeartRateBetween":
                case "HeartRate":
                case "BloodOxygenBetween":
                case "BloodOxygen":
                case "AgeBetween":
                case "Age":
                    if (minValue) {
                        return parseInt(conditionObj.value1);
                    }
                    else {
                        return parseInt(conditionObj.value2);
                    }
                case "TemperatureBetween":
                case "Temperature":
                case "WeightBetween":
                case "Weight":
                    if (minValue) {
                        return parseFloat(conditionObj.value1);
                    }
                    else {
                        return parseInt(conditionObj.value2);
                    }
                case "Sex":
                    if (minValue) {
                        if (conditionObj.value1) {
                            var replacedValue = conditionObj.value1.replace("'", "");
                            replacedValue = replacedValue.replace("'", "");
                            return replacedValue;
                        }
                        else {
                            return conditionObj.value1;
                        }
                    }
                    else {
                        if (conditionObj.value1) {
                            var replacedValue = conditionObj.value1.replace("'", "");
                            replacedValue = replacedValue.replace("'", "");
                            return replacedValue;
                        }
                        else {
                            return conditionObj.value1;
                        }
                    }
                default:
                    return undefined;

            }
        };
        
        self.getConditionValueBasedOnTemplate = function(valueString, template) {
            switch (template.name) {
                case "BloodPressureSystolicBetween":
                case "BloodPressureSystolic":
                case "BloodPressureDiastolicBetween":
                case "BloodPressureDiastolic":
                case "HeartRateBetween":
                case "HeartRate":
                case "BloodOxygenBetween":
                case "BloodOxygen":
                case "AgeBetween":
                case "Age":
                    return parseInt(valueString);
                case "TemperatureBetween":
                case "Temperature":
                case "WeightBetween":
                case "Weight":
                    return parseFloat(valueString);
                case "Sex":
                    return valueString;
                default:
                    return undefined;

            }
        };

        self.isValidCondition = function(condition) {
            switch (condition.name) {
                case "BloodPressureSystolicBetween":
                case "BloodPressureDiastolicBetween":
                case "HeartRateBetween":
                case "BloodOxygenBetween":
                case "TemperatureBetween":
                case "AgeBetween":
                case "WeightBetween":
                    return condition.value1 && condition.value2;
                case "BloodPressureSystolic":
                case "BloodPressureDiastolic":
                case "HeartRate":
                case "BloodOxygen":
                case "Temperature":
                case "Age":
                case "Sex":
                case "Weight":
                    return condition.value1 && condition.operator;
            }
        }

        self.translateCondition = function(condition) {
            var rule = {
                ruleTemplate: condition.name,
                prefix: condition.prefix
            };

            var conditions = [];
            var arguments = [];
            switch (condition.name) {
                case "BloodPressureSystolicBetween":
                    conditions.push({expression: "systolic >= " + condition.value1});
                    conditions.push({expression: "systolic <= " + condition.value2});
                    break;
                case "BloodPressureSystolic":
                    conditions.push({expression: "systolic " + self.getOperator(condition.operator) + " " + condition.value1});
                    break;
                case "BloodPressureDiastolicBetween":
                    conditions.push({expression: "diastolic >= " + condition.value1});
                    conditions.push({expression: "diastolic <= " + condition.value2});
                    break;
                case "BloodPressureDiastolic":
                    conditions.push({expression: "diastolic " + self.getOperator(condition.operator) + " " + condition.value1});
                    break;
                case "HeartRateBetween":
                    conditions.push({expression: "heartRate >= " + condition.value1});
                    conditions.push({expression: "heartRate <= " + condition.value2});
                    break;
                case "HeartRate":
                    conditions.push({expression: "heartRate " + self.getOperator(condition.operator) + " " + condition.value1});
                    break;
                case "BloodOxygenBetween":
                    conditions.push({expression: "bloodOxygen >= " + condition.value1});
                    conditions.push({expression: "bloodOxygen <= " + condition.value2});
                    break;
                case "BloodOxygen":
                    conditions.push({expression: "bloodOxygen " + self.getOperator(condition.operator) + " " + condition.value1});
                    break;
                case "TemperatureBetween":
                    conditions.push({expression: "temperature >= " + condition.value1});
                    conditions.push({expression: "temperature <= " + condition.value2});
                    break;
                case "Temperature":
                    conditions.push({expression: "temperature " + self.getOperator(condition.operator) + " " + condition.value1});
                    break;
                case "AgeBetween":
                    conditions.push({expression: "age >= " + condition.value1});
                    conditions.push({expression: "age <= " + condition.value2});
                    break;
                case "Age":
                    conditions.push({expression: "age " + self.getOperator(condition.operator) + " " + condition.value1});
                    break;
                case "Sex":
                    conditions.push({expression: "sex " + self.getOperator(condition.operator) + " " + condition.value1});
                    break;
                case "WeightBetween":
                    conditions.push({expression: "weight >= " + condition.value1});
                    conditions.push({expression: "weight <= " + condition.value2});
                    break;
                case "Weight":
                    conditions.push({expression: "weight " + self.getOperator(condition.operator) + " " + condition.value1});
                    break;
            }

            arguments.push({textValue: rule.prefix ? "Where" : "WhereNot"});

            if (condition.operator) {
                arguments.push({textValue: condition.operator.id});
            }

            arguments.push({textValue: String(condition.value1)});
            
            if (condition.value2) {
                arguments.push({textValue: String(condition.value2)});
            }

            rule.conditions = conditions;
            rule.arguments = arguments;

            return rule;
        };
        
        self.getOperator = function(operatorName) {
            switch (operatorName.id) {
                case self.operatorValues[0].id:
                    return "==";
                case self.operatorValues[1].id:
                    return "!=";
                case self.operatorValues[2].id:
                    return ">";
                case self.operatorValues[3].id:
                    return ">=";
                case self.operatorValues[4].id:
                    return "<";
                case self.operatorValues[5].id:
                    return "<=";
            }
        };

        return self;

    }]);