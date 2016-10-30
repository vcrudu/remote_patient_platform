/**
 * Created by Victor on 5/25/2016.
 */

(function() {
    function buildArray(source, mapper)
    {
        var all = [];
        for(var i=0; i<source.length; i++)
        {
            var temp = mapper(source[i]);
            all.push(temp);
        }
        return all;
    }

    function mapRuleArgumentToDbEntity(ruleArgument)
    {
        return {
            M: {
                textValue: {S: ruleArgument.textValue},
            }
        };
    }

    function mapRuleConditionToDbEntity(ruleCondition)
    {
        return {
            M: {
                expression: {S: ruleCondition.expression},
            }
        };
    }

    function mapRuleToDbEntity(rule)
    {
        var ruleMap = {
            M:{
                ruleTemplate: {S:rule.ruleTemplate},
                prefix: {BOOL:rule.prefix}
            }
        };

        var arguments = buildArray(rule.arguments, mapRuleArgumentToDbEntity);
        ruleMap.M.arguments = {L:arguments};

        var conditions = buildArray(rule.conditions, mapRuleConditionToDbEntity);
        ruleMap.M.conditions = {L:conditions};

        return ruleMap;
    }

    function mapArgumentFromDbEntity(argumentMap) {
        if (argumentMap && argumentMap.M) {
            return {
                textValue: argumentMap.M.textValue.S
            }
        }

        return null
    }

    function mapConditionFromDbEntity(conditionMap) {
        if (conditionMap && conditionMap.M) {
            return {
                expression: conditionMap.M.expression.S
            }
        }

        return null
    }
    
    module.exports  = {
        mapGlobalAlarmToDbEntity : function(globalAlarm) {
         

            var dbEntity = {
                alarmName: {S: globalAlarm.alarmName},
                alarmDescription: {S: globalAlarm.alarmDescription},
            };

            var rules = buildArray(globalAlarm.rules, mapRuleToDbEntity);

            dbEntity.rules = {L:rules};

            return dbEntity;
        },
        mapGroupAlarmToDbEntity : function(byGroupId, groupAlarm) {
            var dbEntity = {
                groupId: {S: byGroupId},
                alarmName: {S: groupAlarm.alarmName},
                alarmDescription: {S: groupAlarm.alarmDescription},
            };

            var rules = buildArray(groupAlarm.rules, mapRuleToDbEntity);

            dbEntity.rules = {L:rules};

            return dbEntity;
        },
        mapGlobalAlarmFromDbEntity : function(globalAlarm) {
            var appEntity = {
                alarmName: globalAlarm.alarmName.S,
                alarmDescription: globalAlarm.alarmDescription ? globalAlarm.alarmDescription.S : "",
                rules: []
            }

            if (globalAlarm.rules && globalAlarm.rules.L && globalAlarm.rules.L.length > 0) {
                for(var i=0;i<globalAlarm.rules.L.length; i++) {
                    var ruleMap = globalAlarm.rules.L[i].M;

                    if (ruleMap) {
                        var ruleObj = {
                            ruleTemplate: ruleMap.ruleTemplate.S,
                            prefix: ruleMap.prefix.BOOL,
                            arguments: [],
                            conditions: []
                        }

                        if (ruleMap.arguments && ruleMap.arguments.L && ruleMap.arguments.L.length > 0) {
                            ruleObj.arguments = buildArray(ruleMap.arguments.L, mapArgumentFromDbEntity)
                        }

                        if (ruleMap.conditions && ruleMap.conditions.L && ruleMap.conditions.L.length > 0) {
                            ruleObj.conditions = buildArray(ruleMap.conditions.L, mapConditionFromDbEntity)
                        }

                        appEntity.rules.push(ruleObj);
                    }
                }
            }

            return appEntity;
        },
        mapGroupAlarmFromDbEntity : function(groupAlarm) {
            var appEntity = {
                alarmName: groupAlarm.alarmName.S,
                alarmDescription: groupAlarm.alarmDescription ? groupAlarm.alarmDescription.S : "",
                rules: []
            }

            if (groupAlarm.rules && groupAlarm.rules.L && groupAlarm.rules.L.length > 0) {
                for(var i=0;i<groupAlarm.rules.L.length; i++) {
                    var ruleMap = groupAlarm.rules.L[i].M;

                    if (ruleMap) {
                        var ruleObj = {
                            ruleTemplate: ruleMap.ruleTemplate.S,
                            prefix: ruleMap.prefix.BOOL,
                            arguments: [],
                            conditions: []
                        }

                        if (ruleMap.arguments && ruleMap.arguments.L && ruleMap.arguments.L.length > 0) {
                            ruleObj.arguments = buildArray(ruleMap.arguments.L, mapArgumentFromDbEntity)
                        }

                        if (ruleMap.conditions && ruleMap.conditions.L && ruleMap.conditions.L.length > 0) {
                            ruleObj.conditions = buildArray(ruleMap.conditions.L, mapConditionFromDbEntity)
                        }

                        appEntity.rules.push(ruleObj);
                    }
                }
            }

            return appEntity;
        }
    };
})();
