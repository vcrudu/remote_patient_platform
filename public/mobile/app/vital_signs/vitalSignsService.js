angular.module('mobileApp')
    .factory('vitalSignsService',['$http', 'commonService', '_', function($http, commonService, _) {
        return {
            getHistories:function(success, error) {

                var req = {
                    method:'GET',
                    url:commonService.getServerUrl()+'/v1/api/events',
                    headers:{
                        'x-access-token': commonService.getToken()
                    }
                };

                $http(req).success(function(res) {
                    var histories = [];
                    _.forEach(res.result, function (item) {
                        var history = _.find(histories, function (history) {
                            return history.Id === item.measurementType;
                        });
                        var FirstValue;
                        var SecondValue;
                        if (item.measurementType === 'bloodPressure') {
                            FirstValue = item.value.systolic;
                            SecondValue = item.value.diastolic;
                        } else {
                            FirstValue = item.value;
                        }
                        if (history) {
                            history.dashboard.Measurements.push({
                                DateTime: new Date(item.measurementDateTime),
                                UnixSessionDate: item.utcDateTime,
                                FirstValue: FirstValue,
                                SecondValue: SecondValue
                            });
                            history.Measurements.push({
                                DateTime: new Date(item.measurementDateTime),
                                UnixSessionDate: item.utcDateTime,
                                FirstValue: FirstValue,
                                SecondValue: SecondValue
                            });
                        } else {
                            //Todo-here get rid of duplicate device name and type
                            var newHistory = {
                                Id: item.measurementType,
                                Measurements: [
                                    {
                                        DateTime: new Date(item.measurementDateTime),
                                        UnixSessionDate: item.utcDateTime,
                                        FirstValue: FirstValue,
                                        SecondValue: SecondValue
                                    }],
                                dashboard: {
                                    Measurements: [
                                        {
                                            DateTime: new Date(item.measurementDateTime),
                                            UnixSessionDate: item.utcDateTime,
                                            FirstValue: FirstValue,
                                            SecondValue: SecondValue
                                        }
                                    ], deviceType: item.measurementType,
                                    deviceName: item.measurementType
                                }, deviceType: item.measurementType,
                                deviceName: item.measurementType
                            };
                            histories.push(newHistory);
                        }
                    });
                    success(histories);
                }).error(error);
            }
        };
    }]);