/**
 * Created by victorcrudu on 12/10/2016.
 */

var _ = require('underscore');
var assert = require('assert')

(function(){

    function DayTimePoint (args) {
        assert.ok(args.reminders);
        assert.ok(args.time);
        var self = this;
        self.reminders = args.reminders;
        self.time = args.time;
    }

    function SchedulePlan(args) {
        assert.ok(args.dayTimePoints);
        assert.ok(args.scheduleType);
        var self = this;
        self.dayTimePoints = [];
        _.forEach(args.dayTimePoints, function (dayTimePoint) {
            self.dayTimePoints.push(new DayTimePoint(dayTimePoint));
        });

        self.scheduleType = args.scheduleType;
    }

    module.exports = SchedulePlan;
})();