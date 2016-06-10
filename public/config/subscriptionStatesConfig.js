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
            .state('confirm', {
                url: "/confirm",
                views: {
                    "headerView": {templateUrl: "loggedOutHeader.html"},
                    "mainView": {templateUrl: "confirm.html"}
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
                    "headerView": {templateUrl: "registerHeader.html"},
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