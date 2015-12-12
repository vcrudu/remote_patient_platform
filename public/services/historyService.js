/**
 * Created by Victor on 27/10/2015.
 */
(function() {
    angular.module('app').factory('historyService', ['$http', '$localStorage', 'appSettings', '_',
        function ($http, $localStorage, appSettings, _) {
        return {
            getHistories:function(success, error) {

                var req = {
                    method:'GET',
                    url:appSettings.getServerUrl()+'/v1/api/events',
                    headers:{
                        'x-access-token': $localStorage.user.token
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
            },//http://localhost:8081/v1/api/patients/vcrudu@hotmail.com
            getHistoriesByEmail:function(email, success, error) {

                var req = {
                    method:'GET',
                    url:appSettings.getServerUrl()+'/v1/api/events?userName=' +email,
                    headers:{
                        'x-access-token': $localStorage.user.token
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
            },
            getPatientDetails:function(success, error){
                var req = {
                    method:'GET',
                    url:appSettings.getServerUrl()+'/v1/api/patients/'+$localStorage.user.email,
                    headers:{
                        'x-access-token': $localStorage.user.token
                    }
                };

                $http(req).success(function(data){
                        success(data.result);
                    }
                ).error(error);
            },
            getPatientDetailsByEmail:function(email, success, error){
                var req = {
                    method:'GET',
                    url:appSettings.getServerUrl()+'/v1/api/patients/'+email,
                    headers:{
                        'x-access-token': $localStorage.user.token
                    }
                };

                $http(req).success(function(data){
                      success(data.result);
                  }
                ).error(error);
            }
        };
    }]);
})();