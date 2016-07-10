/**
 * Created by Victor on 14/07/2015.
 */

angular.module('app').config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state("patient", {
        url: "/patient",
        views: {
            "headerView": {templateUrl: "patient.header.html"},
            "mainView": {templateUrl: "patient/patient.html"},
            "asideView": {templateUrl: "asideNav.html"}
        },
        controller: 'patientVitalSignsCtrl'
    }).state("patient.home", {
        url: "/patient.home",
        templateUrl: "patient/home/patient.home.html",
        controller: 'patientHomeCtrl'
    }).state("patient.vitalsigns", {
        url: "/patient.vitalsigns?token",
        templateUrl: "patient/vitalSigns/patient.vitalsigns.html",
        controller: 'patientVitalSignsCtrl',
        resolve: {
            promiseObj2: function ($http, $stateParams,$localStorage,appSettings) {
                if ($stateParams.token) {
                    var req = {
                        method: 'POST',
                        url: appSettings.getServerUrl() + '/v1/api/token_signin',
                        headers: {
                            'x-access-token': $stateParams.token
                        }
                    };
                    return $http(req).then(function (res) {
                        if (!res.error) {
                            $localStorage.user = res.data.data;
                            if (window.socket) {
                                window.socket.connect();
                            } else {
                                window.socket = window.io.connect(appSettings.getServerUrl());
                                window.socket.on('connect', function () {
                                    window.socket.emit('authenticate', {token: $localStorage.user.token});
                                    $rootScope.$broadcast('socket.connect', 'connected');
                                });

                                window.socket.on('disconnect', function () {
                                    $rootScope.$broadcast('socket.disconnect', 'disconnected');
                                });
                            }
                        }
                    });
                } else {
                    return null;
                }
            }
        }
    }).state("patient.devices", {
        url: "/patient.devices",
        templateUrl: "patient/devices/patient.devices.html",
        controller: 'patientDevicesCtrl'
    })
       .state("patient.devices.buy", {
            url: "/patient.devices.buy?token",
            templateUrl: "patient/devices/buy.html",
            controller: 'patientDevicesBuyCtrl as vm',
            resolve: {
                promiseObj2: function ($http, $stateParams,$localStorage,appSettings) {
                    if ($stateParams.token) {
                        var req = {
                            method: 'POST',
                            url: appSettings.getServerUrl() + '/v1/api/token_signin',
                            headers: {
                                'x-access-token': $stateParams.token
                            }
                        };
                        return $http(req).then(function (res) {
                            if (!res.error) {
                                $localStorage.user = res.data.data;
                                if (window.socket) {
                                    window.socket.connect();
                                } else {
                                    window.socket = window.io.connect(appSettings.getServerUrl());
                                    window.socket.on('connect', function () {
                                        window.socket.emit('authenticate', {token: $localStorage.user.token});
                                        $rootScope.$broadcast('socket.connect', 'connected');
                                    });

                                    window.socket.on('disconnect', function () {
                                        $rootScope.$broadcast('socket.disconnect', 'disconnected');
                                    });
                                }
                            }
                        });
                    } else {
                        return null;
                    }
                }
            }
        })
        .state("patient.devices.details", {
            url: "/patient.devices.details/:model",
            templateUrl: "patient/devices/details.html",
            controller: 'patientDeviceDetailsCtrl as vm'
        })
        .state("patient.devices.checkout", {
            url: "/patient.devices.checkout",
            templateUrl: "patient/devices/checkout.html",
            controller: 'patientDevicesCheckoutCtrl as vm'
        })
        .state("patient.devices.checkout-pay", {
            url: "/patient.devices.checkout-pay",
            templateUrl: "patient/devices/pay.html",
            controller: 'patientDevicesCheckoutPayCtrl as vm'
        })
        .state("patient.devices.checkout-pay-confirm", {
            url: "/patient.devices.checkout-pay-confirm",
            templateUrl: "patient/devices/pay-confirm.html",
            controller: 'patientDevicesCheckoutPayConfirmCtrl as vm'
        })
        .state("patient.messages", {
            url: "/patient.messages",
            templateUrl: "patient/messages/patient.messages.html",
            controller: 'patientMessagesCtrl'
        }).state("patient.call", {
            url: "/patient.call",
            templateUrl: "patient/appointments/patient.call.html",
            controller: 'patientCallCtrl as vm'
        }).state("patients_groups_members", {
            url: "/patientsgroupmember",
            templateUrl: "patient/appointments/patient.call.html",
            controller: 'patientsGroupsMembers'
            //resolve:{
            //    providers:function($http,$localStorage,appSettings){
            //
            //        var req = {
            //            method: 'GET',
            //            url: appSettings.serverUrl + '/v1/api/providers/',
            //            headers: {
            //                'Access-Control-Request-Origin': 'http://localhost:8081',
            //                'x-access-token': $localStorage.user.token
            //            }
            //        };
            //
            //        return $http(req).then(function(res){
            //            return res.data.result;
            //        });
            //    }
            //}
        })/*.state("patient.appointments", {
            url: "/patient.appointments",
            templateUrl: "patient/appointments/patient.appointments.html",
            controller: 'patientAppointmentsCtrl'
        }).state("patient.appointments.book", {
            url: "/patient.appointments.book",
            templateUrl: "patient/appointments/book.html",
            controller: 'patientAppointmentsBookCtrl'
        })*/.state("patient.appointments", {
        url: "/patient.appointments?token",
        templateUrl: "patient/appointments/patient.appointments.view.html",
        controller: 'patientAppointmentsViewCtrl',
        controllerAs: 'vm',
        resolve: {
            promiseObj2: function ($http, $stateParams, $localStorage, appSettings) {
                if ($stateParams.token) {
                    var req = {
                        method: 'POST',
                        url: appSettings.getServerUrl() + '/v1/api/token_signin',
                        headers: {
                            'x-access-token': $stateParams.token
                        }
                    };
                    return $http(req).then(function (res) {
                        if (!res.error) {
                            $localStorage.user = res.data.data;
                            if (window.socket) {
                                window.socket.connect();
                            } else {
                                window.socket = window.io.connect(appSettings.getServerUrl());
                                window.socket.on('connect', function () {
                                    window.socket.emit('authenticate', {token: $localStorage.user.token});
                                    $rootScope.$broadcast('socket.connect', 'connected');
                                });

                                window.socket.on('disconnect', function () {
                                    $rootScope.$broadcast('socket.disconnect', 'disconnected');
                                });
                            }
                        }
                    });
                } else {
                    return null;
                }
            }
        }
    }).state("patient.settings", {
            url: "/patient.settings",
            templateUrl: "patient/settings/patient.settings.html",
            controller: 'patientSettingsCtrl'
        });
}]);
