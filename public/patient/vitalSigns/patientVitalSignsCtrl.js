/**
 * Created by Victor on 23/06/2015.
 */
(function() {
    angular.module('app').controller('patientVitalSignsCtrl', ['$scope', '$log', '$state', 'toastr', 'authService',
        'historyService','$localStorage',
        function ($scope, $log, $state, toastr, authService, historyService,$localStorage) {
            $scope.bodyClass = "desktop-detected pace-done";
            $scope.gender = $localStorage.user;


            historyService.getHistories(function (histories) {
                    $scope.histories = histories;
                    angular.forEach($scope.histories, function (history) {
                        history.dashboard = {
                            data: history.dashboard,
                            deviceType: history.DeviceType,
                            deviceName: history.DeviceName
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