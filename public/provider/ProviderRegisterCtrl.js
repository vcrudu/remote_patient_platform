angular.module('app')
    .controller('ProviderRegisterCtrl', ['common', 'dataaccess', '$window', 'ProviderService', 'Messaging', function (common, dataaccess, $window, ProviderService, Messaging) {

        var vm = this;

        vm.goBack = function () {
            $window.history.back();
        };

        vm.titles = common.getPersonTitles();
        vm.genders = common.getGenders();
        vm.providerTypes = common.getProviderTypes();
        common.getCountries()
            .then(function (result) {
                vm.countries = result.data;
            });


        vm.newProvider = {
            type: "provider",
            address: {},
            contactDetails: [],
            availabilityType: "regular",
            availabilities: []
        };

        vm.save = function () {

            var toSaveObject = angular.copy(vm.newProvider);

            if (vm.phone) {
                toSaveObject.contactDetails.push({
                    "contactType": "Phone",
                    "contact": vm.phone
                })
            }

            if (vm.mobile) {
                toSaveObject.contactDetails.push({
                    "contactType": "Mobile",
                    "contact": vm.mobile
                })
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
                Messaging.success('sm', 'Success', 'Provider was successfully saved');

            }, function (e) {
                vm.saving = false;
                Messaging.errHandle(e);

            });


        }


    }])
    .directive('weekdaySchedule', ['common', function (common) {
        return {
            restrict: 'AE',
            template: '<div class=" ">' +
            '<div class="row padding-5 "><div class="col-md-4 col-sm-4 daytime-schedule" ng-repeat="day in weekDays" > <div class="well well-light "  >' +
            '<label class="label text-center">{{day.text}}</label><form name="scheduleForm" class="smart-form"><section>' +
            '<label class="textarea" ng-class="{\'state-error\': scheduleForm.schedule.$dirty && scheduleForm.schedule.$invalid}"' +
            '><textarea  rows="4" name="schedule" placeholder="Schedule" schedule-time ng-model="day.schedule"></textarea>' +
            '<b class="tooltip tooltip-top-left">Example: 08:00 - 12:00, 13:00-17:00</b>' +
            '</label>' +
                //'<em ng-show=" scheduleForm.schedule.$dirty && scheduleForm.schedule.$invalid" class="invalid">Time schedule format is invalid.</em>' +
            '</section> </form> </div></div></div></div>',
            replace: true,
            scope: {
                weekDays: '=ngModel'
            },
            link: function (scope, elem, attrs) {

                scope.weekDays = common.getWeekDays();


            }
        }
    }]);
