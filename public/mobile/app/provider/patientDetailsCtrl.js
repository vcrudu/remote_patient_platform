/**
 * Created by Victor on 2/3/2016.
 */

angular.module("mobileApp")
    .controller("ProviderPatientDetailsCtrl",
        ['$scope', '$state', 'commonService', 'providerPatientDetailsService', function($scope, $state, commonService, providerPatientDetailsService) {
                $scope.histories = [];
                $scope.measures = [];
                $scope.currentHistory = null;
                $scope.loaded = false;
                $scope.userId = "";
                $scope.patient = {};

                if ($state && $state.params && $state.params.userId)
                {
                    $scope.userId = $state.params.userId;
                }

                $scope.getHistories = function () {
                        providerPatientDetailsService.getHistories($scope.userId, function (histories) {
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
                                            if (lastMeasure.secondValue)
                                            {
                                                    lastMeasure.valueForUI += "/" + lastMeasure.secondValue;
                                            }

                                            $scope.measures.push(lastMeasure);
                                    });
                            },
                            function (error) {
                                    console.error(error);
                            })
                };

                $scope.getHistories();

                $scope.getPatientDetails = function(loaded) {
                    providerPatientDetailsService.getPatientDetails($scope.userId, function (result) {
                            $scope.patient.birthDate = result.dateOfBirth;
                            $scope.patient.givenName = result.name;
                            $scope.patient.familyName = result.surname;
                            $scope.patient.address1 = result.address.addressLine1;
                            $scope.patient.cityVillage = result.address.town;
                            $scope.patient.county = result.address.county;
                            $scope.patient.postalCode = result.address.postCode;
                            $scope.patient.country = result.address.country;
                            $scope.patient.avatar = result.gender === 'Male' ? '/resourses/img/avatars/male.png' : '/resourses/img/avatars/female.png';
                            $scope.patient.email = result.email;
                            $scope.patient.phoneNumber = result.phone;
                            $scope.patient.mobileNumber = result.mobile;

                            loaded();
                        },
                        function (error) {
                            console.error(error);
                        });
                };

                $scope.getPatientDetails(function() {
                    $scope.loaded = true;
                });

                $scope.goToLatestReadings = function() {
                        $scope.currentHistory = null;
                };

                $scope.viewHistory = function(deviceType)
                {
                        angular.forEach($scope.histories, function (history) {
                                if (history.deviceType === deviceType)
                                {
                                        $scope.currentHistory = history;
                                        return;
                                }
                        });
                };

                $scope.gotoCharts = function()
                {
                    $state.go('patient_charts', {userId:$scope.userId});
                };
        }]);
