/**
 * Created by Victor on 2/8/2016.
 */

angular.module("mobileApp").controller("PatientVitalSignsCtrl", ['$scope', '$state', 'commonService', 'patientVitalSignsService',
    function ($scope, $state, commonService, patientVitalSignsService) {


        $scope.histories = [];
        $scope.measures = [];
        $scope.currentHistory = null;
        $scope.loaded = false;

        $scope.getHistories = function () {
            patientVitalSignsService.getHistories(function (histories) {
                    $scope.histories = histories;
                    angular.forEach($scope.histories, function (history) {
                        history.dashboard = {
                            data: history.dashboard,
                            deviceType: history.deviceType,
                            deviceName: history.deviceName
                        };

                        var momentInstance = moment(history.Measurements.reverse()[0].DateTime);

                        var lastMeasure = {};
                        lastMeasure.device = commonService.getDeviceTypeLabel(history.deviceType);
                        lastMeasure.deviceType = history.deviceType;
                        lastMeasure.deviceUnit = commonService.getDeviceTypeUniLabel(history.deviceType);
                        lastMeasure.time = momentInstance.format("YYYY-MM-DD HH:mm");
                        lastMeasure.firstValue = history.Measurements.reverse()[0].FirstValue;
                        lastMeasure.secondValue = history.Measurements.reverse()[0].SecondValue;
                        lastMeasure.valueForUI = lastMeasure.firstValue;
                        if (lastMeasure.secondValue) {
                            lastMeasure.valueForUI += "/" + lastMeasure.secondValue;
                        }

                        $scope.measures.push(lastMeasure);
                    });

                    $scope.loaded = true;
                },
                function (error) {
                })
        };

        $scope.getHistories();

        $scope.goToLatestReadings = function () {
            $scope.currentHistory = null;
        }

        $scope.viewHistory = function (deviceType) {
            angular.forEach($scope.histories, function (history) {
                if (history.deviceType === deviceType) {
                    $scope.currentHistory = history;
                    return;
                }
            });
        }

        $scope.gotoState = function (state) {
            $state.go(state);
        }

        var subscriber2 = {
            name: 'event-subscriber-2',
            handler: function (data) {
                $scope.result = data;
            }
        };

        window.messageBus.register('sample-event', subscriber2);

        $scope.$on("$destroy", function() {
            window.messageBus.unregister('sample-event', 'event-subscriber-2');
        });
    }]);
