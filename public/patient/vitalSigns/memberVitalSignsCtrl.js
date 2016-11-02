/**
 * Created by developer1 on 10/26/2016.
 */
/**
 * Created by Victor on 23/06/2015.
 */
(function() {
    angular.module('app').controller('memberVitalSignsCtrl', ['$scope', '$log', "$stateParams",'$state', 'toastr', 'authService',
        'memberHistoryService','$localStorage','$rootScope',
        function ($scope, $log, $stateParams, $state, toastr, authService, memberHistoryService,$localStorage, $rootScope) {
            $scope.bodyClass = "desktop-detected pace-done";
            //$scope.gender = $localStorage.user;

           $localStorage.memberemail = $state.params.patient.email;
           $scope.email = $state.params.patient.email;
           $scope.firstname = $state.params.patient.firstname;
           $scope.surname = $state.params.patient.surname;
           $scope.birthDate = $state.params.patient.dateOfBirth;
           $scope.phoneNumber =$state.params.patient.phone;
           $scope.mobileNumber = $state.params.patient.mobile;
           $scope.address1 = $state.params.patient.address.addressLine1;

            $scope.histories = [];

            $scope.latestHistories = {
                bloodPressure: null,
                bloodOxygen: null,
                temperature: null,
                heartRate: null
            }

            if (window.socket && window.socket.connected) {
                window.socket.on('newMeasurement', function (data) {
                    var history = _.find($scope.histories, function (history) {
                        return history.Id === data.measurementType;
                    });

                    var FirstValue;
                    var SecondValue;
                    if (data.measurementType === "bloodPressure") {
                        FirstValue = data.value.systolic;
                        SecondValue = data.value.diastolic;
                    } else {
                        FirstValue = data.value;
                    }

                    var newMeasurement = {
                        DateTime: new Date(data.measurementDateTime),
                        UnixSessionDate: data.utcDateTime,
                        FirstValue: FirstValue,
                        SecondValue: SecondValue
                    };

                    if (history) {
                        history.dashboard.data.Measurements.push(newMeasurement);
                        history.Measurements.push(newMeasurement);
                        var secondValueString = '';
                        if (data.SecondValue) {
                            secondValueString = "/" + SecondValue;
                        }
                        var stringToToast = "Time: " + newMeasurement.DateTime + "\n" + data.measurementType + ": " + FirstValue + secondValueString;

                        toastr.info(stringToToast,
                            'New measurement');

                        $rootScope.$broadcast('newMeasurement', history);
                    }
                    else {
                        var newHistory = {
                            Id: data.measurementType,
                            Measurements: [
                                {
                                    DateTime: new Date(data.measurementDateTime),
                                    UnixSessionDate: data.utcDateTime,
                                    FirstValue: FirstValue,
                                    SecondValue: SecondValue
                                }],
                            dashboard: {
                                data: {
                                    Measurements: [],
                                    deviceType: data.measurementType,
                                    deviceName: data.measurementType
                                },
                                deviceType: data.measurementType,
                                deviceName: data.measurementType
                            }, deviceType: data.measurementType,
                            deviceName: data.measurementType
                        };

                        history = newHistory;

                        $scope.histories.push(history);
                        history.dashboard.data.Measurements.push(newMeasurement);
                        history.Measurements.push(newMeasurement);
                        var secondValueString = '';
                        if (data.SecondValue) {
                            secondValueString = "/" + SecondValue;
                        }
                        var stringToToast = "Time: " + newMeasurement.DateTime + "\n" + data.measurementType + ": " + FirstValue + secondValueString;

                        toastr.info(stringToToast, 'New measurement');

                        $rootScope.$broadcast('newMeasurement', history);
                    }
                });
            }

            $scope.getHistories = function () {
                memberHistoryService.getHistories(function (histories) {
                        $scope.histories = histories;
                        angular.forEach($scope.histories, function (history) {
                            history.dashboard = {
                                data: history.dashboard,
                                deviceType: history.deviceType,
                                deviceName: history.deviceName
                            };
                        });

                        $scope.fillLatestHistories($scope.histories);
                    },
                    function (error) {
                        console.error(error);
                    })
            };

            $scope.fillLatestHistories = function(histories) {
                angular.forEach(histories, function (history) {
                    switch (history.deviceType) {
                        case "bloodPressure":
                            $scope.latestHistories.bloodPressure = history.Measurements[history.Measurements.length - 1];
                            break;
                        case "temperature":
                            $scope.latestHistories.temperature = history.Measurements[history.Measurements.length - 1];
                            break;
                        case "bloodOxygen":
                            $scope.latestHistories.bloodOxygen = history.Measurements[history.Measurements.length - 1];
                            break;
                        case "temperature":
                            $scope.latestHistories.temperature = history.Measurements[history.Measurements.length - 1];
                            break;
                        case "heartRate":
                            $scope.latestHistories.heartRate = history.Measurements[history.Measurements.length - 1];
                            break;
                    }
                });
            };

            $scope.getHistories();
        }
    ]);
})();