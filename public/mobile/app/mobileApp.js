/*
var mobileAppModule = angular.module("mobileApp",
    ['LocalStorageModule', 'ngStorage',
        'angular-underscore', 'underscore','rx', 'ui.calendar', 'ui.bootstrap', 'ui.router', 'ngMessages', 'messageBusModule', 'ngMaterial', 'ngAnimate', 'ngAria', 'mdPickers' ]);*/

var mobileAppModule = angular.module("mobileApp", ["ui.router", "ngMaterial", "ngMessages", "rx", "ngStorage", "ngTouch", "ui.bootstrap"])
    .directive("compareTo", function () {
            return {
                    require: "ngModel",
                    scope: {
                            otherModelValue: "=compareTo"
                    },
                    link: function (scope, element, attributes, ngModel) {

                            ngModel.$validators.compareTo = function (modelValue) {
                                    return modelValue == scope.otherModelValue;
                            };

                            scope.$watch("otherModelValue", function () {
                                    ngModel.$validate();
                            });
                    }
            };
    }).factory('commonService', ['$localStorage', function ($localStorage) {
            return {
                    getToken: function (callback) {
                            if ((/android/gi).test(navigator.userAgent)) {
                                    Bridge.getToken(callback);
                            } else {
                                    setTimeout(function () {
                                            callback($localStorage.user.token);
                                    }, 0);
                            }
                    },
                    getServerUrl: function (callback) {
                            if ((/android/gi).test(navigator.userAgent)) {
                                    Bridge.getUrl(callback);
                            } else {
                                    setTimeout(function () {
                                            callback("http://192.168.0.12:8081/v1/api/");
                                    }, 0);
                            }
                    },
                    getPublicServerUrl: function (callback) {
                            if ((/android/gi).test(navigator.userAgent)) {
                                    Bridge.getUrl(callback);
                            } else {
                                    setTimeout(function () {
                                            callback("http://192.168.0.12:8081/");
                                    }, 0);
                            }
                    }
            };
    }]);
