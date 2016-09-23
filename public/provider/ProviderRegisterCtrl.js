angular.module('app')
    .controller('ProviderRegisterCtrl', ['$scope','common', 'dataaccess', '$window', 'ProviderService', 'Messaging',
        '$filter','$modal', '$state', '$timeout',function ($scope, common, dataaccess, $window, ProviderService, Messaging,$filter,$modal, $state, $timeout) {

            var vm = this;

            vm.isProviderMenuItemActive = true;
            vm.isPatientMenuItemActive = false;

            vm.goBack = function () {
                $state.go('login');
            };

            vm.goForward = function () {
                if(!$scope.firstForm.email.$pending){
                    $scope.rc.sampleWizard.forward();
                }
            };

            vm.titles = common.getPersonTitles();
            vm.genders = common.getGenders();
            vm.providerTypes = common.getProviderTypes();
            common.getCountries()
                .then(function (result) {
                    vm.countries = result.data;
                });

            vm.events = [];


            vm.newProvider = {
                type: "provider",
                address: {},
                contactDetails: [],
                availabilityType: "regular",
                availabilities: []
            };

            vm.isAvailabilityValid = function () {
                if (vm.daysSchedule && vm.daysSchedule.length > 0) {
                    angular.forEach(vm.daysSchedule, function (scheduleItem) {
                        if (scheduleItem.length > 0 && scheduleItem != 'NA') {
                            return true;
                        }
                    });
                }
                return false;
            };

            vm.save = function () {

                var toSaveObject = angular.copy(vm.newProvider);

                if (vm.mobile) {
                    toSaveObject.phone = vm.mobile;
                }

                angular.forEach(vm.daysSchedule, function (d) {

                    if (d.schedule && d.schedule.length) {

                        var periods = d.schedule.split(',');

                        angular.forEach(periods, function (period) {
                            var day = {
                                day: d.value,
                                startTime: period.split('-')[0],
                                endTime: period.split('-')[1]

                            };
                            toSaveObject.availabilities.push(day)
                        })

                    }
                });

                vm.saving = true;
                ProviderService.save(toSaveObject)
                    .then(function (result) {
                        vm.saving = false;
                        Messaging.success('sm', 'Success', 'Your details have been submitted successfully!');
                        $timeout(function () {
                            $state.go('need-activate');
                        }, 1000);

                    }, function (e) {
                        vm.saving = false;
                        Messaging.errHandle(e);

                    });
            }
        }])
    .directive('weekdaySchedule', ['common', function (common) {
        return {
            restrict: 'AE',
            templateUrl: 'provider/weekdaySchedule.html',
            replace: true,
            scope: {
                weekDays: '=ngModel'
            },
            link: function (scope, elem, attrs) {

                scope.weekDays = common.getWeekDays();


            }
        }
    }]);
