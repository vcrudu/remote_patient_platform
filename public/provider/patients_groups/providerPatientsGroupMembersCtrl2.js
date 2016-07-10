'use strict';
var controllerId = 'providerPatientsGroupMembersCtrl2';
angular.module('app')

    .controller(controllerId, ['$scope', '$http', 'common', '$filter', '$location', 'localStorageService', '$rootScope', 'config', function
        ($scope, $http, common, $filter, $location, localStorageService, $rootScope, config) {

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);


        var vm = this;
        vm.title = 'Patients';


        function activate() {
            common.activateController([], controllerId)
                .then(function () {
//                    log('Activated Patients View');
                });
        };

        activate();


        $scope.addPatient = function () {
            if ($scope.nurse === undefined) {
                return;
            }

            $location.path('/patient');

        };
        $scope.openPatient = function (patient) {
            if (patient === undefined) {
                return;
            }

            $location.path('/patient').search({patientid: patient.Id});

        };

        $scope.openDevices = function (patient) {
            if (patient === undefined) {
                return;
            }
            $location.path('/devices').search({patientid: patient.Id, patientGivenName: patient.Names[0].GivenName});

        };

        $scope.openAlarmTemplates = function (patient) {
            if (patient) {
                $location.path('/alarmtemplates/' + patient.Id);
            }
        };

        $scope.openRules = function (patient) {
            if (patient) {
                $location.path('/rules/' + patient.Id);
            }
        };

        $scope.searchKeywords = ''
        $scope.filteredPatients = []
        $scope.row = ''

        $scope.select = function (page) {
            var start = (page - 1) * $scope.numPerPage;
            var end = start + $scope.numPerPage;
            $scope.currentPagePatients = $scope.filteredPatients.slice(start, end);
        };

        $scope.onFilterChange = function () {
            $scope.select(1);
            $scope.currentPage = 1;
            $scope.row = '';
        };

        $scope.onNumPerPageChange = function () {
            $scope.select(1);
            $scope.currentPage = 1;
        };

        $scope.onOrderChange = function () {
            $scope.select(1);
            $scope.currentPage = 1;
        }


        $scope.search = function () {
            $scope.filteredPatients = $filter('filter')($scope.patients, $scope.searchKeywords);
            $scope.onFilterChange();
        }





//         orderBy
        $scope.order = function (rowName) {
            if ($scope.row == rowName) {
                if(rowName.substring(0,1) == '-'){
                    rowName = rowName.substring(1,rowName.length-2);
                }
                else{
                    rowName = '-'+rowName;
                }
            }
            $scope.row = rowName;
            $scope.filteredPatients = $filter('orderBy')($scope.patients, rowName);
//            # console.log
            $scope.filteredPatients
            $scope.onOrderChange()
        }

//        # pagination
        $scope.numPerPageOpt = [3, 5, 10, 20]
        $scope.numPerPage = $scope.numPerPageOpt[2]
        $scope.currentPage = 1
        $scope.currentPagePatients = []


        $scope.searchPatients = function (nurse) {

            $http.get(common.serviceUrl + 'nurse/patients/' + nurse.Id, { headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8'
            }
            }).success(function (patients) {

                $scope.patients = patients;

                $scope.search();
                $scope.select($scope.currentPage);

            }).error(function (err) {
                common.logger.logError(err.Message, '', '', true);

            });


        }
//        # init


        $rootScope.$on(config.events.patientAddedSuccesfully, function (event, data) {
            $scope.searchPatients($scope.nurse);
        });

        $rootScope.$on(config.events.patientUpdatedSuccesfully, function (event, data) {
            $scope.searchPatients($scope.nurse);
        });

        var init = function () {

            $http.get(common.serviceUrl + 'nurse/nurse/' + common.userName(), { headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8'
            }
            }).success(function (nurse) {

                $scope.nurse = nurse;
                localStorageService.set('nurse', nurse)

                $scope.searchPatients(nurse);

            }).error(function (err) {
                common.logger.logError(err.Message, '', '', true);

            });


        }


        init();


    }])