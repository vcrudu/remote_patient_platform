angular.module('mobileApp')
    .factory('vitalSignsService',['$http','rx', 'commonService', '_', function($http, rx, commonService, _) {
        return {
            getHistories:function(success, error) {
                var tokenSource = rx.Observable.fromCallback(commonService.getToken)();
                var urlSource = rx.Observable.fromCallback(commonService.getServerUrl)();
                var source = rx.Observable.when(tokenSource.and(urlSource).thenDo(function (token, url) {
                    return {token:token, url:url};
                }));

                source.subscribe(
                    function (x) {
                        var req = {
                            method: 'GET',
                            url: x.url + 'events?token='+x.token
                        };
                        $http(req).success(function (res) {
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
                );
            }
        };
    }]);
