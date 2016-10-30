/**
 * Created by developer1 on 10/6/2016.
 */
/**
 * Created by Victor on 5/25/2016.
 */

(function() {
    function mapRemindersFromDbEntity(dbReminders) {
        var result = [];
        dbReminders.L.forEach(function (reminder) {
            result.push(reminder.S);
        });
        return result;
    }

    function mapDayTimePointsFromDbEntity(dbDayTimePoints) {
       

        var result = [];
        dbDayTimePoints.L.forEach(function (dbDayTimePoint) {
            result.push({
                reminders: mapRemindersFromDbEntity(dbDayTimePoint.M.reminders),
                time: dbDayTimePoint.M.time.S
            });
        });
        return result;
    }

    function mapRemindersToDbEntity(reminders) {
        var result = [];
        reminders.forEach(function (reminder) {
            result.push({ S: reminder.toString() });
        });
        return result;
    }

    function mapDayTimePointsToDbEntity(dayTimePoints) {
       

        var result = [];
        dayTimePoints.forEach(function (dayTimePoint) {
            result.push({
                M: {
                    reminders: { L: mapRemindersToDbEntity(dayTimePoint.reminders) },
                    time: { S: dayTimePoint.time }
                }
            });
        });
        return result;
    }
    module.exports  = {

      //  mapSchedulePlanFromDbEntity : function(byGroupId, dbEntity) {
        mapSchedulePlanFromDbEntity : function(schedulePlan) {

          


            return {
                groupId: schedulePlan.groupId.S,
                scheduleName: schedulePlan.scheduleName.S,
                dayTimePoints: mapDayTimePointsFromDbEntity(schedulePlan.dayTimePoints)
                //dayTimePoints: mapDayTimePointsFromDbEntity(dbEntity.dayTimePoints)
            };
        },

     //   mapSchedulePlanToDbEntity : function(byGroupId, scheduleName, entity) {
        mapSchedulePlanToDbEntity : function(byGroupId, scheduleName) {
            return {
                groupId: {S: byGroupId},
                scheduleName: { S: scheduleName.scheduleName },
                dayTimePoints: {L:mapDayTimePointsToDbEntity(scheduleName.scheduleTime)}
              //  scheduleName: { S: entity.scheduleName }
              //  dayTimePoints: { L: mapDayTimePointsToDbEntity(entity.dayTimePoints) }
            };
        }
    };
})();
