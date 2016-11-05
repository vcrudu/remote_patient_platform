'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by Victor on 26/06/2015.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _logging = require('../logging');

var _logging2 = _interopRequireDefault(_logging);

var _globalMeasurementScheduleDbMapper = require('./globalMeasurementScheduleDbMapper');

var _globalMeasurementScheduleDbMapper2 = _interopRequireDefault(_globalMeasurementScheduleDbMapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TABLE_NAME = 'GlobalMeasurementSchedule';

var GlobalMeasurementScheduleRepository = function () {
    function GlobalMeasurementScheduleRepository(dynamoDb) {
        _classCallCheck(this, GlobalMeasurementScheduleRepository);

        this._dynamoDb = dynamoDb;
    }

    _createClass(GlobalMeasurementScheduleRepository, [{
        key: 'createTable',
        value: function createTable(callback) {

            var params = {

                TableName: TABLE_NAME,

                KeySchema: [{ AttributeName: "scheduleType", KeyType: "HASH" }],

                AttributeDefinitions: [{ AttributeName: "scheduleType", AttributeType: "S" }],

                ProvisionedThroughput: {
                    ReadCapacityUnits: 5,
                    WriteCapacityUnits: 5
                }
            };

            this._dynamoDb.createTable(params, function (err, data) {

                if (err) {
                    callback(err, null);
                }

                if (data) {
                    callback(null, data);
                }
            });
        }
    }, {
        key: 'deleteTable',
        value: function deleteTable(callback) {

            var params = {
                TableName: TABLE_NAME
            };

            /*this._dynamoDb.deleteTable(params, function (err) {

                if (err) {
                    callback(err, false);
                } else {
                    callback(null, true);
                }
            });*/
        }
    }, {
        key: 'getOne',
        value: function getOne(scheduleType, callback) {
            var params = {
                Key: { scheduleType: { S: scheduleType } },
                TableName: TABLE_NAME,
                ReturnConsumedCapacity: 'TOTAL'
            };

            this._dynamoDb.getItem(params, function (err, data) {
                if (err) {
                    _logging2.default.getLogger().error(err);
                    callback(err, null);
                    return;
                }
                _logging2.default.getLogger().debug("The notification has been found successfully.");
                if (data.Item) {
                    var globalMeasurementScheduleDbMapper = new _globalMeasurementScheduleDbMapper2.default();
                    var globalMeasurementSchedule = globalMeasurementScheduleDbMapper.mapFromDbEntity(data.Item);
                    callback(null, globalMeasurementSchedule);
                } else {
                    callback(null, null);
                }
            });
        }
    }, {
        key: 'save',
        value: function save(globalMeasurementSchedule, callback) {
            var globalMeasurementScheduleDbMapper = new _globalMeasurementScheduleDbMapper2.default();
            var params = {
                Item: globalMeasurementScheduleDbMapper.mapToDbEntity(globalMeasurementSchedule),
                TableName: TABLE_NAME,
                ReturnConsumedCapacity: 'TOTAL',
                ReturnItemCollectionMetrics: 'SIZE',
                ReturnValues: 'ALL_OLD'
            };

            this._dynamoDb.putItem(params, function (err, data) {
                if (err) {
                    _logging2.default.getLogger().error(err);
                    callback(err, null);
                    return;
                }

                _logging2.default.getLogger().debug("The event has been inserted successfully.");
                callback(null, data);
            });
        }
    }]);

    return GlobalMeasurementScheduleRepository;
}();

module.exports = GlobalMeasurementScheduleRepository;