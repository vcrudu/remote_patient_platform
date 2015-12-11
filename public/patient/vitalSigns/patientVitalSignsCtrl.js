/**
 * Created by Victor on 23/06/2015.
 */
(function() {
    angular.module('app').controller('patientVitalSignsCtrl', ['$scope', '$log', '$state', 'toastr', 'authService',
        'historyService','$localStorage','$rootScope',
        function ($scope, $log, $state, toastr, authService, historyService,$localStorage, $rootScope) {
            $scope.bodyClass = "desktop-detected pace-done";
            $scope.gender = $localStorage.user;
            $scope.histories = [];

            if (window.socket && window.socket.connected) {
                window.socket.on('newMeasurement', function (data) {
                    debugger;
                    var history = _.find($scope.histories, function (history) {
                        return history.Id === data.measurementType;
                    });

                    var FirstValue;
                    var SecondValue;
                    if(data.measurementType=== "bloodPressure"){
                        FirstValue = data.value.systolic;
                        SecondValue = data.value.diastolic;
                    }else{
                        FirstValue = data.value;
                    }

                    var newMeasurement = {
                        DateTime: new Date(data.measurementDateTime),
                        UnixSessionDate: data.utcDateTime,
                        FirstValue: FirstValue,
                        SecondValue: SecondValue
                    };

                    history.dashboard.data.Measurements.push(newMeasurement);
                    var secondValueString='';
                    if(data.SecondValue){
                        secondValueString = "/"+SecondValue;
                    }
                    var stringToToast = "Time: "+newMeasurement.DateTime +"\n"+data.measurementType+": "+FirstValue + secondValueString;

                    toastr.info(stringToToast,
                        'New measurement');

                    $rootScope.$broadcast('newMeasurement', history);
                });
            }

            historyService.getHistories(function (histories) {
                    $scope.histories = histories;
                    angular.forEach($scope.histories, function (history) {
                        history.dashboard = {
                            data: history.dashboard,
                            deviceType: history.deviceType,
                            deviceName: history.deviceName
                        };
                    });
                },
                function (error) {
                    console.error(error);
                });

            historyService.getPatientDetails(function (result) {
                    $scope.birthDate = result.dateOfBirth;
                     $scope.givenName = result.name;
                     $scope.familyName = result.surname;
                     $scope.address1 = result.address.addressLine1;
                     $scope.cityVillage = result.address.town;
                     $scope.county = result.address.county;
                     $scope.postalCode = result.address.postCode;
                     $scope.country = result.address.country;
                     $scope.avatar= result.gender==='Male'?'/resourses/img/avatars/male.png':'/resourses/img/avatars/female.png';
                     $scope.email = result.email;
                     $scope.phoneNumber = result.phone;
                     $scope.mobileNumber = result.mobile;
                },
                function (error) {
                    console.error(error);
                });
        }
    ]);
})();