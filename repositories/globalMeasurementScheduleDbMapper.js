"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by home on 31.07.2015.
 */

var GlobalMeasurementScheduleDbMapper = function () {
    function GlobalMeasurementScheduleDbMapper() {
        _classCallCheck(this, GlobalMeasurementScheduleDbMapper);
    }

    _createClass(GlobalMeasurementScheduleDbMapper, [{
        key: "_mapRemindersFromDbEntity",
        value: function _mapRemindersFromDbEntity(dbReminders) {
            var result = [];
            dbReminders.L.forEach(function (reminder) {
                result.push(parseInt(reminder.N));
            });
            return result;
        }
    }, {
        key: "_mapDayTimePointsFromDbEntity",
        value: function _mapDayTimePointsFromDbEntity(dbDayTimePoints) {
            var _this = this;

            var result = [];
            dbDayTimePoints.L.forEach(function (dbDayTimePoint) {
                result.push({
                    reminders: _this._mapRemindersFromDbEntity(dbDayTimePoint.M.reminders),
                    time: dbDayTimePoint.M.time.S
                });
            });
            return result;
        }
    }, {
        key: "_mapRemindersToDbEntity",
        value: function _mapRemindersToDbEntity(reminders) {
            var result = [];
            reminders.forEach(function (reminder) {
                result.push({ N: reminder.toString() });
            });
            return result;
        }
    }, {
        key: "_mapDayTimePointsToDbEntity",
        value: function _mapDayTimePointsToDbEntity(dayTimePoints) {
            var _this2 = this;

            var result = [];
            dayTimePoints.forEach(function (dayTimePoint) {
                result.push({
                    M: {
                        reminders: { L: _this2._mapRemindersToDbEntity(dayTimePoint.reminders) },
                        time: { S: dayTimePoint.time }
                    }
                });
            });
            return result;
        }
    }, {
        key: "mapFromDbEntity",
        value: function mapFromDbEntity(dbEntity) {
            return {
                scheduleType: dbEntity.scheduleType.S,
                dayTimePoints: this._mapDayTimePointsFromDbEntity(dbEntity.dayTimePoints)
            };
        }
    }, {
        key: "mapToDbEntity",
        value: function mapToDbEntity(entity) {
            return {
                scheduleType: { S: entity.scheduleType },
                dayTimePoints: { L: this._mapDayTimePointsToDbEntity(entity.dayTimePoints) }
            };
        }
    }]);

    return GlobalMeasurementScheduleDbMapper;
}();

exports.default = GlobalMeasurementScheduleDbMapper;