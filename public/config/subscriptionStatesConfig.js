/**
 * Created by Victor on 14/07/2015.
 */

(function () {

    angular.module('app').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        //$urlRouterProvider.otherwise("/login");
        $urlRouterProvider.when('', '/login');
        $stateProvider

            .state('login', {
                url: "/login",
                views: {
                    "headerView": {templateUrl: "loggedOutHeader.html"},
                    "mainView": {templateUrl: "login.html"}
                },
                controller: 'loginCtrl'
            })
            .state('reset', {
                url: "/reset",
                views: {
                    "headerView": {templateUrl: "loggedOutHeader.html"},
                    "mainView": {templateUrl: "reset.html"}
                },
                controller: 'resetCtrl'
            })
            .state('resetPassword', {
                url: "/resetPassword?token",
                views: {
                    "headerView": {templateUrl: "loggedOutHeader.html"},
                    "mainView": {templateUrl: "resetPassword.html"}
                },
                controller: 'resetPasswordCtrl'
            })
            .state('confirmSubmit', {
                url: "/confirmSubmit",
                views: {
                    "headerView": {templateUrl: "loggedOutHeader.html"},
                    "mainView": {templateUrl: "confirmSubmit.html"}
                }
            })
            .state('activate', {
                url: "/activate",
                views: {
                    "headerView": {
                        templateUrl: "activateHeader.html"
                    },
                    "mainView": {
                        templateUrl: "activate.html",
                        controller:'activateCtrl as ctrl'
                    }
                },
                resolve: {
                    activateState: function ($http, $state, $localStorage, $location, $rootScope, appSettings) {
                        var params = $location.search();
                        if (params.token) {
                            var req = {
                                method: 'POST',
                                url: appSettings.getServerUrl() + '/v1/api/activate',
                                headers: {
                                    'x-access-token': params.token
                                }
                            };
                            return $http(req).then(function (res) {
                                if (!res.data.error) {
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
                                } else{
                                    return {isActive:false};
                                }
                            });
                        } else {
                            return {isActive:false};
                        }
                    }
                }
            })
            .state('need-activate', {
                url: "/need-activate",
                views: {
                    "headerView": {templateUrl: "loggedOutHeader.html"},
                    "mainView": {
                        templateUrl: "needActivate.html",
                        controller:"needActivateCtrl"
                    }
                },
                controller: 'needActivateCtrl'
            })
            .state('check-email-box', {
                url: "/check-email-box",
                views: {
                    "headerView": {templateUrl: "loggedOutHeader.html"},
                    "mainView": {templateUrl: "checkEmailBox.html"}
                }
            })
            .state('provider-join', {
                url: "/provider-join",
                views: {
                    "headerView": {templateUrl: "loggedOutHeader.html"},
                    "mainView": {templateUrl: "providerJoin.html"}
                }
            })
            .state('notfound', {
                url: "/notfound",
                views: {
                    "headerView": {templateUrl: "loggedOutHeader.html"},
                    "mainView": {templateUrl: "notfound.html"}
                }
            })
            .state('login.username', {
                url: "/:userName",
                views: {
                    "headerView": {templateUrl: "loggedOutHeader.html"},
                    "mainView": {templateUrl: "login.html"}
                },
                controller: 'loginCtrl'
            })
            .state('register', {
                url: "/register",
                views: {
                    "headerView": {templateUrl: "registerHeader.html"},
                    "mainView": {templateUrl: "register.html"}
                },
                controller: 'registerCtrl'
            })
            .state('register.basic', {
                url: "/basic",
                templateUrl: "register.basic.html",
                controller: 'registerBasicCtrl',
                data: {
                    previousState: undefined,
                    nextState: "register.address",
                    order: 1
                }
            }).state('register.address', {
            url: "/address",
            templateUrl: "register.address.html",
            controller: 'registerAddressCtrl',
            data: {
                previousState: "register.basic",
                nextState: "register.medical",
                order: 2
            }
        }).state('register.medical', {
            url: "/medical",
            templateUrl: "register.medical.html",
            controller: 'registerMedicalCtrl',
            data: {
                previousState: "register.address",
                nextState: "register.save",
                order: 3
            }
        }).state('register.save', {
                url: "/save",
                templateUrl: "register.save.html",
                controller: 'registerCtrl',
                data: {
                    previousState: "register.medical",
                    nextState: NaN,
                    order: 4
                }
            })
            //Provider register
            .state('provider-register', {
                url: "/provider-register",
                views: {
                    "headerView": {
                        templateUrl: "providerRegisterHeader.html",
                    },
                    "mainView": {
                        templateUrl: "provider/register.html",
                        controller: 'ProviderRegisterCtrl as vm'
                    },
                    data: {
                        nextState: NaN,
                        order: 1
                    }
                },
            });
        $urlRouterProvider.otherwise('/notfound');
        //Provider register
    }]);
})();